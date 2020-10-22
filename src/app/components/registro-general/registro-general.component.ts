import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { firestore } from 'firebase';
import { ToastrService } from 'ngx-toastr';
import { DataService } from '../../services/data.service';
import { UsersService } from '../../services/users.service';
import { Validators } from '@angular/forms';
import { forEachChild } from 'typescript';

@Component({
  selector: 'app-registro-general',
  templateUrl: './registro-general.component.html',
  styleUrls: ['./registro-general.component.css'],
})
export class RegistroGeneralComponent implements OnInit {
  profile = '';
  showHome = true;
  showLogout = false;
  captcha: string;
  listadoImagenes;
  pacientes = [];
  profesionales = [];
  practices: any;
  user;
  fotoUno = '';
  fotoDos = '';
  captchaResolved: boolean = false;
  registrationForm: FormGroup;

  doctorRegistrationForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private usersService: UsersService,
    private db: AngularFirestore,
    private fireStorage: AngularFireStorage,
    private fireAuth: AngularFireAuth,
    private toastr: ToastrService,
    private data: DataService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.registrationForm = this.fb.group({
      email: new FormControl('', [
        Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
      ]),
      password: new FormControl(''),
      repeatPassword: new FormControl(''),
      firstName: new FormControl(''),
      lastName: new FormControl(''),
      file: [],
      file2: [],
    });
    this.doctorRegistrationForm = this.fb.group({
      email: new FormControl(''),
      password: new FormControl(''),
      repeatPassword: new FormControl(''),
      firstName: new FormControl(''),
      lastName: new FormControl(''),
      practices: new FormControl(''),
      newPractice: new FormControl(''),
      file: [],
    });
    this.data.getPractices().then((response) => {
      this.practices = response;
    });
  }

  nuevo(opcion: string) {
    this.user = opcion;
  }

  resolved(event) {
    this.captchaResolved = true;
  }

  register() {
    if (this.user == 'patient') {
      this.registerPatient();
    } else {
      this.registerDoctor();
    }
  }
  cancel() {
    this.user = undefined;
  }

  registerPatient() {
    this.usersService
      .createUser(
        this.registrationForm.value.email,
        this.registrationForm.value.password
      )
      .then(() => {
        const file = this.registrationForm.value.file._files[0];
        const file2 = this.registrationForm.value.file2._files[0];

        const randomId = Math.random().toString(36).substring(2);
        const randomId2 = Math.random().toString(36).substring(2);

        const fileRef = this.fireStorage.storage.ref(
          `patients/${randomId}.jpg`
        );
        const fileRef2 = this.fireStorage.storage.ref(
          `patients/${randomId2}.jpg`
        );
        fileRef.put(file);
        fileRef2.put(file2);

        this.db.collection('users').doc(this.registrationForm.value.email).set({
          nombre: this.registrationForm.value.firstName,
          apellido: this.registrationForm.value.lastName,
          email: this.registrationForm.value.email,
          contraseña: this.registrationForm.value.password,
          fotoUno: randomId,
          fotoDos: randomId2,
          perfil: this.user,
        });
        this.usersService.initializeAppointments(
          this.registrationForm.value.email
        );
        this.fireAuth.currentUser.then((user) => {
          user.sendEmailVerification();
        });
        this.toastr.success(
          'Por favor verifique su correo electrónico, donde encontrará un link de activación. Sera redirigido en breve...'
        );
        setTimeout(() => {
          this.router.navigate(['Login']);
        }, 3000);
      })
      .catch((error) => {
        this.toastr.error('Email ya registrado');
      });
  }
  registerDoctor() {
    this.usersService
      .createUser(
        this.doctorRegistrationForm.value.email,
        this.doctorRegistrationForm.value.password
      )
      .then(() => {
        const file = this.doctorRegistrationForm.value.file._files[0];
        const randomId = Math.random().toString(36).substring(2);
        const fileRef = this.fireStorage.storage.ref(`doctors/${randomId}.jpg`);
        fileRef.put(file);
        this.db
          .collection('users')
          .doc(this.doctorRegistrationForm.value.email)
          .set({
            nombre: this.doctorRegistrationForm.value.firstName,
            apellido: this.doctorRegistrationForm.value.lastName,
            email: this.doctorRegistrationForm.value.email,
            contraseña: this.doctorRegistrationForm.value.password,
            perfil: this.user,
            especialidades: this.doctorRegistrationForm.value.practices,
            activo: false,
          });
        this.usersService.initializeDoctorAppointments(
          this.doctorRegistrationForm.value.email
        );

        this.usersService.addPracticeDoctor(
          this.doctorRegistrationForm.value.practices,
          this.doctorRegistrationForm.value.email
        );

        this.fireAuth.currentUser.then((user) => {
          user.sendEmailVerification();
        });
        this.toastr.success(
          'Por favor verifique su correo electrónico, donde encontrará un link de activación. Sera redirigido en breve..'
        );
        setTimeout(() => {
          this.router.navigate(['Login']);
        }, 3000);
      })
      .catch((error) => {
        this.toastr.error('Email ya registrado');
      });
  }

  addPractice() {
    let practiceArray: any[] = this.practices;
    let isPracticeOnList: boolean = false;
    practiceArray.forEach((practice) => {
      if (practice.nombre === this.doctorRegistrationForm.value.newPractice) {
        this.toastr.error('Especialidad ya incluida');
        isPracticeOnList = true;
      }
    });
    if (!isPracticeOnList) {
      this.data.createPractice(this.doctorRegistrationForm.value.newPractice);
      this.data.getPractices().then((response) => {
        this.practices = response;
      });
      this.doctorRegistrationForm.patchValue({ newPractice: '' });
      this.toastr.success('Se agrego la especialidad a la lista de selección.');
    }
  }

  get emailCheck() {
    return this.registrationForm.get('email');
  }
}
