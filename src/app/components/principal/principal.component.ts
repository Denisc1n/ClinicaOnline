import { Component, Input, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { DataService } from '../../services/data.service';
import { UsersService } from '../../services/users.service';
import { MedicalHistoryComponent } from './medical-history/medical-history.component';
import { SummaryModalComponent } from './summary-modal/summary-modal.component';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.css'],
})
export class PrincipalComponent implements OnInit {
  summary: string;

  showHome = true;
  profile = 'patient';
  showLogout = true;

  public currentUser;

  public appointments;
  userProfile;

  displayedColumns: string[] = [
    'doctorName',
    'email',
    'date',
    'time',
    'actions',
    'medicalHistory',
  ];

  constructor(
    private userService: UsersService,
    private fireAuth: AngularFireAuth,
    private dataService: DataService,
    private toastr: ToastrService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.userService.getCurrentUser().then((data: any) => {
      this.currentUser = data;
      this.userProfile = this.currentUser.profile;
      this.dataService
        .getAppointments({
          userType: data.perfil,
          email: this.currentUser.email,
        })
        .then((data) => {
          this.appointments = data;
        });
    });
  }

  cancelAppointment(appointment) {
    this.dataService.setAppointmentCancel(appointment);
    this.dataService
      .getAppointments({
        userType: this.currentUser.perfil,
        email: this.currentUser.email,
      })
      .then((data) => {
        this.appointments = data;
      });
    this.toastr.error('Turno Cancelado.');
  }
  activateAppointment(appointment) {
    const dialogRef = this.dialog.open(MedicalHistoryComponent, {
      width: '1500px',
      data: { readOnly: false },
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        try {
          let medicalHistory = [];
          result.forEach((element) => {
            medicalHistory.push(element);
            // medicalHistory[element.field] = element.value;
          });

          let newHistory = {
            doctorEmail: this.currentUser.email,
            doctorName: appointment.doctorName,
            patientEmail: appointment.patient,
            patientName: appointment.patientName,
            appointmentId: appointment.id,
            medicalHistory,
          };
          this.dataService.saveMedicalHistory(newHistory);

          this.dataService.setAppointmentComplete(appointment);
          this.dataService
            .getAppointments({
              userType: this.currentUser.perfil,
              email: this.currentUser.email,
            })
            .then((data) => {
              this.appointments = data;
            });
          this.toastr.success('Historia Clínica guardada.');
        } catch (error) {
          this.toastr.error('Error al guardar la historia clínica.');
        }
      }
    });
  }
  writeSummary(appointment) {
    const dialogRef = this.dialog.open(SummaryModalComponent, {
      width: '500px',
      data: { summary: '', readOnly: false },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const summaryParams = {
          summary: result,
          userType: this.currentUser.perfil,
          sender:
            this.currentUser.perfil == 'doctor'
              ? appointment.doctorName
              : appointment.patientName,
          senderEmail:
            this.currentUser.perfil == 'doctor'
              ? appointment.doctor
              : appointment.patient,
          appointmentDate: appointment.date,
          receiver:
            this.currentUser.perfil == 'doctor'
              ? appointment.patientName
              : appointment.doctorName,
          receiverEmail:
            this.currentUser.perfil == 'doctor'
              ? appointment.patient
              : appointment.doctor,
          appointmentId: appointment.id,
        };

        this.dataService.saveSummary(summaryParams);
        this.dataService.saveAppointmentStatus(
          appointment,
          this.currentUser.perfil
        );
        this.dataService
          .getAppointments({
            userType: this.currentUser.perfil,
            email: this.currentUser.email,
          })
          .then((data) => {
            this.appointments = data;
          });
        this.toastr.success('Reseña guardada con exito.');
      }
    });
  }

  readSummary(element) {
    let datos;

    this.dataService
      .retrieveSummary(this.currentUser.email, element.id)
      .then((data) => {
        data.docs.forEach((data) => {
          datos = data.data();
          datos.id = data.id;
        });
        const dialogRef = this.dialog.open(SummaryModalComponent, {
          width: '500px',
          data: { summary: datos.summary, readOnly: true },
        });
      });
  }

  showMedicalHistory(appointment) {
    let receivedData;

    this.dataService
      .retrieveMedicalHistory(this.currentUser.email, appointment.id)
      .then((data) => {
        data.docs.forEach((data) => {
          receivedData = data.data();
          receivedData.id = data.id;
          const dialogRef = this.dialog.open(MedicalHistoryComponent, {
            width: '500px',
            data: { receivedData, readOnly: true },
          });
        });
      });
  }
}
