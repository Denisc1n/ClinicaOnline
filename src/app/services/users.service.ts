import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { rejects } from 'assert';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  constructor(
    private fireAuth: AngularFireAuth,
    private db: AngularFirestore
  ) {}

  currentUser;

  usuarios = [];

  createUser(email: string, password: string) {
    return this.fireAuth.createUserWithEmailAndPassword(email, password);
  }

  getAppointments(email: string) {
    return this.db.collection('patient-appointments').doc(email).ref.get();
  }
  initializeAppointments(email: string) {
    this.db.collection('patient-appointments').doc(email).set({
      turnos: [],
    });
  }
  initializeDoctorAppointments(email: string) {
    this.db.collection('doctor-appointments').doc(email).set({
      turnos: [],
    });
  }
  getCurrentUser() {
    let currUserEmail;
    let currUser;
    return new Promise((resolve, reject) => {
      this.fireAuth.currentUser
        .then((response) => {
          currUserEmail = response.email;
          this.db
            .collection('users')
            .ref.where('email', '==', currUserEmail)
            .get()
            .then((response) => {
              currUser = response.docs[0].data();
              resolve(currUser);
            });
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  getUserProfile(email) {
    return new Promise((resolve, reject) => {
      this.db
        .collection('users')
        .ref.doc(email)
        .get()
        .then((response) => {
          resolve(response.data().perfil);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  addPracticeDoctor(practice, email) {
    this.db
      .collection('practices')
      .ref.where('nombre', 'in', practice)
      .get()
      .then((response) => {
        response.docs.forEach((doc) => {
          let profesionales: any[] = doc.data().profesionales;

          if (!profesionales.includes(email)) {
            profesionales.push(email);
            this.db.collection('practices').doc(doc.id).update({
              profesionales,
            });
          }
        });
      });
  }
}
