import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-registro-administrador',
  templateUrl: './registro-administrador.component.html',
  styleUrls: ['./registro-administrador.component.css'],
})
export class RegistroAdministradorComponent implements OnInit {
  profile = 'administrator';
  showHome = true;
  showLogout = true;
  constructor(
    private usersService: UsersService,
    private db: AngularFirestore,
    private fireAuth: AngularFireAuth,
    private toastr: ToastrService,
    private router: Router
  ) {}
  adminRegistrationForm = new FormGroup({
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    email: new FormControl(''),
    password: new FormControl(''),
    repeatPassword: new FormControl(''),
  });
  ngOnInit(): void {}

  register() {
    this.usersService
      .createUser(
        this.adminRegistrationForm.value.email,
        this.adminRegistrationForm.value.password
      )
      .then(() => {
        this.db
          .collection('users')
          .doc(this.adminRegistrationForm.value.email)
          .set({
            nombre: this.adminRegistrationForm.value.firstName,
            apellido: this.adminRegistrationForm.value.lastName,
            email: this.adminRegistrationForm.value.email,
            contraseña: this.adminRegistrationForm.value.password,
            perfil: 'administrator',
            activo: true,
          });

        this.toastr.success('Usuario registrado con exito.');
        this.router.navigate(['Administrador']);
      });
  }
  cancel() {
    this.router.navigate(['Administrador']);
  }
}
