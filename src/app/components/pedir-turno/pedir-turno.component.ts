import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { app } from 'firebase';
import { ToastrService } from 'ngx-toastr';
import { element } from 'protractor';
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
  specialtyDoctors = [];
  practices: any;
  selectedPractice;
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
  weekDays = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes'];
  weekDoctors;
  showWeekDoctors = false;
  doctorsAvailable = false;

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
    this.selectedPractice = null;
    this.showAppointmentBoard = false;
    this.showSpecialtyDoctors = false;
    this.listadoMostrar = 'doctor-list';
  }
  filterPractice() {
    this.selectedPractice = null;
    this.showWeekDoctors = false;
    this.showAppointmentBoard = false;
    this.listadoMostrar = 'practice-list';
  }
  filterWeek() {
    this.selectedPractice = null;
    this.showSpecialtyDoctors = false;
    this.showAppointmentBoard = false;
    this.listadoMostrar = 'listado-semana';
  }
  selectPractice(practice) {
    this.selectedPractice = practice;
    this.dataService.retrieveDoctorsByPractice(practice).then((data) => {
      let responseDoctors = [];
      data.forEach((element) => {
        responseDoctors.push(element.data());
      });
      this.specialtyDoctors = responseDoctors;
      this.showSpecialtyDoctors = true;
    });
  }

  selectProfesional(email) {
    this.dataService
      .getProfesional(email)
      .then((data: any) => {
        this.selectedDoctor = data;
        this.doctorDays = data.horarios.dias;
      })
      .then((value) => {
        this.dataService
          .getAppointmentsByDate({
            email,
            date: this.datePipe.transform(this.date.value, 'MM-dd-yyyy'),
          })
          .then((data: []) => {
            data.forEach((element: any) => {
              if (this.appointments.includes(element.time)) {
                this.appointments = this.appointments.filter(
                  (appointmentTime) => {
                    if (appointmentTime !== element.time) {
                      return appointmentTime;
                    }
                  }
                );
              }
            });
          })
          .then(() => {
            let selectedDate = new Date(this.date.value);

            selectedDate.setHours(
              parseInt(
                selectedDate.getDate() != 6
                  ? this.selectedDoctor.horarios.finSemana.hour
                  : this.selectedDoctor.horarios.finSabado.hour
              )
            );
            selectedDate.setMinutes(
              parseInt(
                selectedDate.getDate() != 6
                  ? this.selectedDoctor.horarios.finSemana.minute
                  : this.selectedDoctor.horarios.finSabado.minute
              )
            );
            selectedDate.setSeconds(0);

            this.appointments = this.appointments.filter((time) => {
              let appointmentDate = new Date(this.date.value);
              const timeArray = time.split(':');
              const timeObject = { hour: timeArray[0], minute: timeArray[1] };
              appointmentDate.setHours(parseInt(timeObject.hour));
              appointmentDate.setMinutes(parseInt(timeObject.minute));
              appointmentDate.setSeconds(0);

              if (selectedDate >= appointmentDate) {
                return time;
              }
              //else if (selectedDate == appointmentDate) {
              //   return time;
              // }
            });
          });
      });
    this.showAppointmentBoard = true;
  }
  saveAppointment() {
    try {
      let standardDate = this.datePipe.transform(
        new Date(this.date.value),
        'MM-dd-yyyy'
      );
      let practice;
      if (this.selectedDoctor.especialidades.length > 1) {
        practice = null;
      } else {
        practice = this.selectedDoctor.especialidades[0];
      }

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
        practice: this.selectedPractice ?? practice,
      });
      this.toastr.success('Turno Registrado.');
      this.router.navigate(['Principal']);
    } catch (error) {
      console.log(error);
      this.toastr.error('Error al registrar el turno');
    }
  }

  retrieveAvailableAppointments() {
    this.appointments = appointments;
    this.dataService
      .getAppointmentsByDate({
        email: this.selectedDoctor.email,
        date: this.datePipe.transform(this.date.value, 'MM-dd-yyyy'),
      })
      .then((data: []) => {
        data.forEach((element: any) => {
          if (this.appointments.includes(element.time)) {
            this.appointments = this.appointments.filter((appointmentTime) => {
              if (
                appointmentTime !== element.time &&
                // this.selectedDoctor.horarios.dias.includes(appointmentTime) &&
                !element.isCancelled
              ) {
                return appointmentTime;
              }
            });
          }
        });
      })
      .then(() => {
        let selectedDate = new Date(this.date.value);

        selectedDate.setHours(
          parseInt(
            selectedDate.getDate() != 6
              ? this.selectedDoctor.horarios.finSemana.hour
              : this.selectedDoctor.horarios.finSabado.hour
          )
        );
        selectedDate.setMinutes(
          parseInt(
            selectedDate.getDate() != 6
              ? this.selectedDoctor.horarios.finSemana.minute
              : this.selectedDoctor.horarios.finSabado.minute
          )
        );
        selectedDate.setSeconds(0);
        this.appointments = this.appointments.filter((time) => {
          let appointmentDate = new Date(this.date.value);
          const timeArray = time.split(':');
          const timeObject = { hour: timeArray[0], minute: timeArray[1] };
          appointmentDate.setHours(parseInt(timeObject.hour));
          appointmentDate.setMinutes(parseInt(timeObject.minute));
          appointmentDate.setSeconds(0);
          if (selectedDate >= appointmentDate) {
            return time;
          }
        });
      });
  }

  selectWeekday(weekday) {
    this.dataService
      .retrieveDoctorsByDay(weekday.toLowerCase())
      .then((response) => {
        this.weekDoctors = response;
        if (this.weekDoctors.length == 0) {
          this.doctorsAvailable = false;
        } else {
          this.doctorsAvailable = true;
        }
        this.showWeekDoctors = true;
      });
  }
}
