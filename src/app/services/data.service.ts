import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';

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
      this.db
        .collection('doctors')
        .valueChanges()
        .subscribe(
          (datos) => {
            resolve(datos);
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
}
