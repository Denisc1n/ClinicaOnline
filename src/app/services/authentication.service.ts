import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  constructor(private AFauth: AngularFireAuth) {}

  login(email: string, password: string) {
    return new Promise((resolve, reject) => {
      this.AFauth.signInWithEmailAndPassword(email, password)
        .then((user) => {
          resolve(user);
        })
        .catch((err) => {
          reject(err);
        });

      //const user = this.getCurrentUser().then((user) => console.log(user));
    });
  }
}
