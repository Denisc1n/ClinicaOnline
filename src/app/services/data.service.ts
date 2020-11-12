import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { resolve } from 'dns';
import { app } from 'firebase';
import { forEachChild } from 'typescript';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor(private db: AngularFirestore, private datePipe: DatePipe) {}

  getPractices() {
    let practices = [];
    return new Promise((resolve, reject) => {
      this.db
        .collection('practices')
        .get()
        .subscribe((data) => {
          data.docs.forEach((doc) => {
            practices.push(doc.data());
          });

          resolve(practices);
        });
    });
  }

  createPractice(newPracticeName) {
    this.db
      .collection('practices')
      .add({ nombre: newPracticeName, profesionales: new Array() });
  }

  getProfesionales() {
    return new Promise((resolve, reject) => {
      let doctors = [];
      this.db
        .collection('users')
        .ref.where('perfil', '==', 'doctor')
        .get()
        .then(
          (datos) => {
            datos.docs.forEach((doctor) => {
              doctors.push(doctor.data());
            });
            resolve(doctors);
          },
          (error) => reject(error)
        );
    });
  }
  getTodasEspecialidades() {
    return new Promise((resolve, reject) => {
      this.db
        .collection('practices')
        .valueChanges()
        .subscribe(
          (datos) => {
            resolve(datos);
          },
          (error) => reject(error)
        );
    });
  }

  getPendingApprovalDoctors() {
    let pendingDoctors = [];
    return new Promise((resolve, reject) => {
      this.db
        .collection('users')
        .ref.where('perfil', '==', 'doctor')
        .where('activo', '==', false)
        .get()
        .then((data) => {
          data.docs.forEach((doc) => {
            pendingDoctors.push(doc.data());
          });
          resolve(pendingDoctors);
        });
    });
  }

  getProfesional(email) {
    return new Promise((resolve, reject) => {
      this.db
        .collection('users')
        .ref.doc(email)
        .get()
        .then((response) => {
          resolve(response.data());
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  setAppointment(params) {
    this.db.collection('appointments').add({
      doctor: params.doctorEmail,
      patient: params.patientEmail,
      date: params.date,
      time: params.time,
      isComplete: false,
      doctorName: params.doctorName,
      patientName: params.patientName,
      isCancelled: false,
      isDone: false,
      hasSummaryDoctor: false,
      hasSummaryPatient: false,
      practice: params.practice,
    });
  }

  getAppointments(params) {
    let pendingAppointments = [];
    return new Promise((resolve, reject) => {
      this.db
        .collection('appointments')
        .snapshotChanges()
        .subscribe((response: any) => {
          response.map((res) => {
            if (
              res.payload.doc.data()[params.userType] == params.email &&
              params.userType != 'all'
            ) {
              let appointment = {
                id: res.payload.doc.id,
                ...res.payload.doc.data(),
              };

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
                })
                .finally(() => {
                  resolve(pendingAppointments);
                });
            }
          });

          pendingAppointments = pendingAppointments.sort((a, b) => {
            return new Date(b.date).getDate() - new Date(a.date).getDate();
          });
          resolve(pendingAppointments);
        });
    });
  }

  getAppointmentsByDate(params) {
    let pendingAppointments = [];
    return new Promise((resolve, reject) => {
      this.db
        .collection('appointments')
        .ref.where('doctor', '==', params.email)
        .where('date', '==', params.date)
        .get()
        .then((data) => {
          data.docs.forEach((doc) => {
            let docData = doc.data();
            docData.id = doc.id;
            pendingAppointments.push(docData);
          });
          resolve(pendingAppointments);
        });
    });
  }

  setAppointmentDone(params) {
    this.db.collection('appointments').doc(params.id).update({ isDone: true });
  }
  setAppointmentCancel(params) {
    this.db
      .collection('appointments')
      .doc(params.id)
      .update({ isCancelled: true, isDone: true });
  }
  saveAppointmentStatus(params, userType) {
    let updatedStates;
    if (userType == 'patient') {
      updatedStates = { hasSummaryPatient: true };
    } else {
      updatedStates = { hasSummaryDoctor: true };
    }

    this.db.collection('appointments').doc(params.id).update(updatedStates);
  }

  setAppointmentComplete(params) {
    this.db
      .collection('appointments')
      .doc(params.id)
      .update({ isComplete: true });
  }
  saveSummary(params) {
    this.db.collection('summaries').add(params);
  }

  retrieveSummary(email, id) {
    return this.db
      .collection('summaries')
      .ref.where('appointmentId', '==', id)
      .where('receiverEmail', '==', email)
      .get();
  }

  saveMedicalHistory(params) {
    this.db.collection('medicalHistories').add(params);
  }

  retrieveMedicalHistory(email, id) {
    return this.db
      .collection('medicalHistories')
      .ref.where('appointmentId', '==', id)
      .get();
  }

  retrieveDoctorsByPractice(practice) {
    return this.db
      .collection('users')
      .ref.where('perfil', '==', 'doctor')
      .where('especialidades', 'array-contains', practice)
      .get();
  }

  retrieveDoctorsByDay(day) {
    let filteredDoctors = [];
    return new Promise((resolve, reject) => {
      this.db
        .collection('users')
        .valueChanges()
        .subscribe((subscription) => {
          subscription.forEach((user: any) => {
            if (
              user.perfil === 'doctor' &&
              user.activo &&
              user.horarios.dias.includes(day)
            ) {
              filteredDoctors.push(user);
            }
          });
          resolve(filteredDoctors);
        });
    });
  }

  updateAppointmentPractice(appointment, practice) {
    this.db
      .collection('appointments')
      .ref.where('doctor', '==', appointment.doctor)
      .where('date', '==', appointment.date)
      .where('time', '==', appointment.time)
      .get()
      .then((data) => {
        data.forEach((appointment) => {
          this.db.collection('appointments').doc(appointment.id).update({
            practice,
          });
        });
      });
  }
}
