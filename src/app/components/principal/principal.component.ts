import { Component, Input, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { DataService } from '../../services/data.service';
import { UsersService } from '../../services/users.service';
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
          console.log(this.appointments);
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
        console.log(this.appointments);
      });
    this.toastr.error('Turno Cancelado.');
  }
  activateAppointment(appointment) {
    this.dataService.setAppointmentDone(appointment);
    this.dataService
      .getAppointments({
        userType: this.currentUser.perfil,
        email: this.currentUser.email,
      })
      .then((data) => {
        this.appointments = data;
      });
    this.toastr.success('Turno Atendido. Reseña Disponible.');
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
        this.dataService.setAppointmentComplete(
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
        console.log(data);
        data.docs.forEach((data) => {
          console.log(data.data());
          datos = data.data();
          datos.id = data.id;
        });
        const dialogRef = this.dialog.open(SummaryModalComponent, {
          width: '500px',
          data: { summary: datos.summary, readOnly: true },
        });
      });
  }
}
