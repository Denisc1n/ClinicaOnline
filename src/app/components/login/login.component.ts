import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { admin } from 'firebase-admin/lib/credential';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from '../../services/authentication.service';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  public username;
  public password;
  showLogout = false;
  showHome = false;

  preloadedUsers = [
    {
      tipo: 'Admin',
      email: 'admin@yopmail.com',
      password: 'admin1',
    },
    {
      tipo: 'Paciente',
      email: 'mrodr@yopmail.com',
      password: '123456',
    },
    {
      tipo: 'Doctor',
      email: 'doctorcli@yopmail.com',
      password: '123456',
    },
  ];

  constructor(
    private authenticationService: AuthenticationService,
    private toastrService: ToastrService,
    private router: Router,
    private usersService: UsersService
  ) {}

  loginForm = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
  });

  ngOnInit(): void {}

  login() {
    this.authenticationService
      .login(this.loginForm.value.email, this.loginForm.value.password)
      .then((res: firebase.auth.UserCredential) => {
        this.usersService
          .getUserProfile(this.loginForm.value.email)
          .then((user) => {
            if (user != 'administrator') {
              if (res.user.emailVerified) {
                this.router.navigate(['/Principal']);
              } else {
                this.toastrService.error(
                  'Por favor, verifique su correo electrónico clickeando en el link que le fue enviado a la dirección indicada en el registro',
                  'Verificacion Pendiente',
                  { positionClass: 'toast-center-center' }
                );
              }
            } else {
              this.router.navigate(['/Administrador']);
            }
          });
      })
      .catch((error) => {
        this.toastrService.error(
          'Los datos son incorrectos o no existe el usuario',
          'Error',
          { positionClass: 'toast-center-center' }
        );
      });
  }

  completeValues(user) {
    this.authenticationService
      .login(user.email, user.password)
      .then((res: firebase.auth.UserCredential) => {
        this.usersService.getUserProfile(user.email).then((user) => {
          if (user != 'administrator') {
            if (res.user.emailVerified) {
              this.router.navigate(['/Principal']);
            } else {
              this.toastrService.error(
                'Por favor, verifique su correo electrónico clickeando en el link que le fue enviado a la dirección indicada en el registro',
                'Verificacion Pendiente',
                { positionClass: 'toast-center-center' }
              );
            }
          } else {
            this.router.navigate(['/Administrador']);
          }
        });
      })
      .catch((error) => {
        this.toastrService.error(
          'Los datos son incorrectos o no existe el usuario',
          'Error',
          { positionClass: 'toast-center-center' }
        );
      });
  }
}
