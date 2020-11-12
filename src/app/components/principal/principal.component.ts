import { Component, Input, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatDialog } from '@angular/material/dialog';
import { app } from 'firebase';
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';
import { collapseTextChangeRangesAcrossMultipleVersions } from 'typescript';
import { DataService } from '../../services/data.service';
import { UsersService } from '../../services/users.service';
import { CancelarTurnoComponent } from './cancelar-turno/cancelar-turno.component';
import { MedicalHistoryComponent } from './medical-history/medical-history.component';
import { SelectPracticeComponent } from './select-practice/select-practice.component';
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
  doctor;
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
    public dialog: MatDialog,
    private db: AngularFirestore
  ) {}

  ngOnInit(): void {
    this.userService.getCurrentUser().then((userData: any) => {
      this.currentUser = userData;
      this.userProfile = this.currentUser.profile;
      this.getAppointments({
        userType: userData.perfil,
        email: this.currentUser.email,
      });
      //     email: this.currentUser.email, });
      // this.dataService
      //   .getAppointments({
      //     userType: userData.perfil,
      //     email: this.currentUser.email,
      //   })
      //   .then((data: any) => {
      // this.appointments = data;
      if (userData.perfil == 'doctor') {
        this.dataService
          .getProfesional(this.currentUser.email)
          .then((doctor) => {
            this.doctor = doctor;
          });
      }
    });
  }

  cancelAppointment(appointment) {
    console.log('aca');
    const dialogRefCancel = this.dialog.open(CancelarTurnoComponent, {
      width: '500px',
      data: { summary: '', readonly: false },
      disableClose: true,
    });

    dialogRefCancel.afterClosed().subscribe((result) => {
      this.dataService.setAppointmentCancel(appointment, result);
      this.dataService
        .getAppointments({
          userType: this.currentUser.perfil,
          email: this.currentUser.email,
        })
        .then((data) => {
          this.appointments = data;
        });
      this.toastr.error('Turno Cancelado.');
    });
  }
  activateAppointment(appointment) {
    if (appointment.practice == null) {
      const dialogRefPractice = this.dialog.open(SelectPracticeComponent, {
        width: '500px',
        data: { practice: '', practices: this.doctor.especialidades },
        disableClose: true,
      });

      dialogRefPractice.afterClosed().subscribe((result) => {
        if (result) {
          this.dataService.updateAppointmentPractice(appointment, result);
        }

        const dialogRef = this.dialog.open(MedicalHistoryComponent, {
          width: '1500px',
          data: { readOnly: false },
          disableClose: true,
        });

        dialogRef.afterClosed().subscribe((result) => {
          if (result) {
            try {
              let newHistoryData = {};
              let historyInfo = {
                doctorEmail: this.currentUser.email,
                doctorName: appointment.doctorName,
                patientEmail: appointment.patient,
                patientName: appointment.patientName,
                appointmentId: appointment.id,
              };
              result.forEach((element) => {
                newHistoryData = {
                  ...historyInfo,
                  ...newHistoryData,
                  [`dato{*}${element.fieldName}`]: element.fieldValue,
                };
              });

              this.dataService.saveMedicalHistory(newHistoryData);

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
      });
    } else {
      const dialogRef = this.dialog.open(MedicalHistoryComponent, {
        width: '1500px',
        data: { readOnly: false },
        disableClose: true,
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          try {
            let newHistoryData = {};
            let historyInfo = {
              doctorEmail: this.currentUser.email,
              doctorName: appointment.doctorName,
              patientEmail: appointment.patient,
              patientName: appointment.patientName,
              appointmentId: appointment.id,
            };
            result.forEach((element) => {
              newHistoryData = {
                ...historyInfo,
                ...newHistoryData,
                [`dato{*}${element.fieldName}`]: element.fieldValue,
              };
            });

            this.dataService.saveMedicalHistory(newHistoryData);

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
    let receivedData = [];

    this.dataService
      .retrieveMedicalHistory(this.currentUser.email, appointment.id)
      .then((data) => {
        data.docs.forEach((data) => {
          const fieldsReceived = Object.entries(data.data());

          fieldsReceived.forEach((element) => {
            if (element[0].includes('{*}')) {
              const fieldName = element[0].split('{*}', 2)[1];
              const fieldValue = element[1];
              receivedData.push({ fieldName, fieldValue });
            }
          });
          const dialogRef = this.dialog.open(MedicalHistoryComponent, {
            width: '500px',
            data: { receivedData, readOnly: true },
          });
        });
      });
  }

  getAppointments(params) {
    let pendingAppointments = [];
    this.db
      .collection('appointments')
      .snapshotChanges()
      .subscribe((response: any) => {
        pendingAppointments = [];
        response.map((res) => {
          if (
            res.payload.doc.data()[params.userType] == params.email &&
            params.userType != 'all'
          ) {
            let appointment;
            if (!res.payload.doc.data().isCancelled) {
              appointment = {
                id: res.payload.doc.id,
                ...res.payload.doc.data(),
                status: res.payload.doc.data().isComplete
                  ? 'Completo'
                  : 'Pendiente',
              };
            } else {
              appointment = {
                id: res.payload.doc.id,
                ...res.payload.doc.data(),
                status: 'Cancelado',
              };
            }

            pendingAppointments.push(appointment);
          }
          if (params.userType == 'all') {
            this.db
              .collection('medicalHistories')
              .ref.where('appointmentId', '==', res.payload.doc.id)
              .get()
              .then((data) => {
                if (data.docs.length) {
                  data.docs.forEach((doc) => {
                    let trimmedData = {};
                    const fieldsReceived = Object.entries(doc.data());
                    fieldsReceived.forEach((element) => {
                      if (element[0].includes('{*}')) {
                        const fieldName = element[0].split('{*}', 2)[1];
                        const fieldValue = element[1];
                        trimmedData[fieldName] = fieldValue;
                      }
                    });
                    let appointment = {
                      id: res.payload.doc.id,
                      ...res.payload.doc.data(),
                      ...trimmedData,
                      status: res.payload.doc.data().isComplete
                        ? 'Completo'
                        : 'Pendiente',
                    };
                    pendingAppointments.push(appointment);
                  });
                } else {
                  if (res.payload.doc.data().isCancelled) {
                    let appointment = {
                      id: res.payload.doc.id,
                      ...res.payload.doc.data(),
                      status: 'Cancelado',
                    };
                    pendingAppointments.push(appointment);
                  } else {
                    let appointment = {
                      id: res.payload.doc.id,
                      ...res.payload.doc.data(),
                      status: 'Pendiente',
                    };
                    pendingAppointments.push(appointment);
                  }
                }
              })
              .finally(() => {
                pendingAppointments = pendingAppointments.sort((a, b) => {
                  return (
                    new Date(b.date).getDate() - new Date(a.date).getDate()
                  );
                });
              });
          }
        });
        this.appointments = [];
        this.appointments = pendingAppointments;
        pendingAppointments = pendingAppointments.sort((a, b) => {
          return new Date(b.date).getDate() - new Date(a.date).getDate();
        });
      });
  }
}
