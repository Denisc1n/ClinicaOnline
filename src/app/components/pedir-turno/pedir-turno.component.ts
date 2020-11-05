import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DataService } from '../../services/data.service';
import { UsersService } from '../../services/users.service';
import { appointments } from './appointments';
@Component({
  selector: 'app-pedir-turno',
  templateUrl: './pedir-turno.component.html',
  styleUrls: ['./pedir-turno.component.css'],
})
export class PedirTurnoComponent implements OnInit {
  showHome = true;
  showLogout = true;
  profile = 'patient';
  doctors: any;
  practices: any;
  showSpecialtyDoctors: boolean;
  listadoMostrar: string = 'doctor-list';
  showAppointmentBoard = false;
  selectedDays: string[] = [];
  minDate;
  maxDate;
  selectedDoctor;
  doctorDays;
  date = new FormControl(new Date());
  selectedTime = new FormControl('');
  serializedDate = new FormControl(new Date().toISOString());
  appointments = appointments;
  currentUser;

  sundayFilter = (d: Date | null): boolean => {
    let dayNumbers = [];
    const day = (d || new Date()).getDay();
    this.selectedDoctor?.horarios.dias.forEach((element) => {
      switch (element) {
        case 'lunes':
          dayNumbers.push(1);
          break;
        case 'martes':
          dayNumbers.push(2);
          break;
        case 'miercoles':
          dayNumbers.push(3);
          break;
        case 'jueves':
          dayNumbers.push(4);
          break;
        case 'viernes':
          dayNumbers.push(5);
          break;
        case 'sabado':
          dayNumbers.push(6);
          break;
      }
    });
    return dayNumbers.find((x) => x == day);
  };

  start = new FormControl('', (control: FormControl) => {
    const value = control.value;
    if (!value) {
      return null;
    }

    if (value.hour < this.selectedDoctor.horarios.inicioSemana.hour) {
      return { tooEarly: true };
    }
    if (value.hour > this.selectedDoctor.horarios.finSemana.hour) {
      return { tooLate: true };
    }

    return null;
  });

  end = new FormControl('', (control: FormControl) => {
    const value = control.value;

    if (!value) {
      return null;
    }

    if (value.hour <= this.start.value.hour) {
      return {
        tooEarly: true,
      };
    }
    if (value.hour > 19) {
      return { tooLate: true };
    }

    return null;
  });

  constructor(
    private dataService: DataService,
    private usersService: UsersService,
    private datePipe: DatePipe,
    private toastr: ToastrService,
    private router: Router
  ) {
    const currentDate = new Date();
    this.minDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate()
    );
    this.maxDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate() + 30
    );
  }

  ngOnInit(): void {
    this.dataService.getProfesionales().then((datos) => {
      this.doctors = datos;
    });
    this.dataService.getTodasEspecialidades().then((datos) => {
      this.practices = datos;
    });
    this.usersService.getCurrentUser().then((data: any) => {
      this.currentUser = {
        email: data.email,
        name: `${data.apellido}, ${data.nombre}`,
      };
    });
  }
  filterLastName() {
    this.listadoMostrar = 'doctor-list';
  }
  filterPractice() {
    this.listadoMostrar = 'practice-list';
  }
  filterWeek() {
    this.listadoMostrar = 'listado-semana';
  }
  selectPractice(practice) {}

  selectProfesional(email) {
    this.dataService.getProfesional(email).then((data: any) => {
      this.selectedDoctor = data;
      this.doctorDays = data.horarios.dias;
    });
    this.showAppointmentBoard = true;
  }
  saveAppointment() {
    try {
      let standardDate = this.datePipe.transform(
        new Date(this.date.value),
        'dd-MM-yyyy'
      );
      this.dataService.setAppointment({
        doctorEmail: this.selectedDoctor.email,
        patientEmail: this.currentUser.email,
        date: standardDate,
        time: this.selectedTime.value,
        doctorName: `${this.selectedDoctor.apellido}, ${this.selectedDoctor.nombre}`,
        patientName: this.currentUser.name,
        hasSummaryDoctor: false,
        hasSummaryPatient: false,
        isDone: false,
        isComplete: false,
        isCancelled: false,
      });
      this.toastr.success('Turno Registrado.');
      this.router.navigate(['Principal']);
    } catch (error) {
      this.toastr.error('Error al registrar el turno');
    }
  }

  checkDay() {
    let date = new Date(this.date.value);
    if (date.getDay() === 6) {
    }
  }
}
