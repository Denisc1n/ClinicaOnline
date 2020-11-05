import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { resolve } from 'dns';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor(private db: AngularFirestore) {}

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
    });
  }

  getAppointments(params) {
    let pendingAppointments = [];

    return new Promise((resolve, reject) => {
      this.db
        .collection('appointments')
        .ref.where(params.userType, '==', params.email)
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
}
