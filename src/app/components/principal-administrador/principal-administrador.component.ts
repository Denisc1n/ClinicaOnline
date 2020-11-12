import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-principal-administrador',
  templateUrl: './principal-administrador.component.html',
  styleUrls: ['./principal-administrador.component.css'],
})
export class PrincipalAdministradorComponent implements OnInit {
  profile = 'administrator';
  showHome = true;
  showLogout = true;
  showAppointments = false;
  appointments;

  constructor(private dataService: DataService, private db: AngularFirestore) {}

  ngOnInit(): void {
    this.getAppointments({ userType: 'all' });
  }

  changeView() {
    this.showAppointments = true;
  }
  handleHideTable(event) {
    this.showAppointments = false;
  }

  getAppointments(params) {
    let pendingAppointments = [];
    this.db
      .collection('appointments')
      .snapshotChanges()
      .subscribe((response: any) => {
        pendingAppointments = [];

        console.log(response);
        response.map((res) => {
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
                    let i = 0;
                    fieldsReceived.forEach((element) => {
                      if (element[0].includes('{*}')) {
                        let fieldName = element[0].split('{*}', 2)[1];
                        let fieldValue = element[1];
                        if (
                          fieldName != 'Presion' &&
                          fieldName != 'TemperaturaCorporal' &&
                          fieldName != 'Edad' &&
                          fieldName != 'Peso'
                        ) {
                          fieldName = `${'CampoDinamico'}${i}`;
                          trimmedData[fieldName] = {
                            value: fieldValue,
                            name: element[0].split('{*}', 2)[1],
                          };
                          i++;
                        } else {
                          trimmedData[fieldName] = fieldValue;
                        }
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
        console.log(pendingAppointments);
        this.appointments = pendingAppointments;
        pendingAppointments = pendingAppointments.sort((a, b) => {
          return new Date(b.date).getDate() - new Date(a.date).getDate();
        });
      });
  }
}
