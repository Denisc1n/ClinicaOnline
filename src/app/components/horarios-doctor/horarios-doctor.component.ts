import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import { toJSDate } from '@ng-bootstrap/ng-bootstrap/datepicker/ngb-calendar';
import { ToastrService } from 'ngx-toastr';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-horarios-doctor',
  templateUrl: './horarios-doctor.component.html',
  styleUrls: ['./horarios-doctor.component.css'],
})
export class HorariosDoctorComponent implements OnInit {
  showHome = true;
  profile = 'doctor';
  showLogout = true;
  showSaturdayTimePick = false;
  days: string[] = [];
  currentUser;
  selectedDays: string[] = [];
  weekdays = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];

  start = new FormControl('', (control: FormControl) => {
    const value = control.value;
    if (!value) {
      return null;
    }

    if (value.hour < 9) {
      return { tooEarly: true };
    }
    if (value.hour > 19) {
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

  startSaturday = new FormControl('', (control: FormControl) => {
    const value = control.value;
    if (!value) {
      return null;
    }

    if (value.hour < 9) {
      return { tooEarly: true };
    }
    if (value.hour > 14) {
      return { tooLate: true };
    }

    return null;
  });

  endSaturday = new FormControl('', (control: FormControl) => {
    const value = control.value;

    if (!value) {
      return null;
    }

    if (value.hour <= this.startSaturday.value.hour) {
      return {
        tooEarly: true,
      };
    }
    if (value.hour > 14) {
      return { tooLate: true };
    }

    return null;
  });

  constructor(
    private usersService: UsersService,
    private toastrService: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.usersService.getCurrentUser().then((data: any) => {
      this.currentUser = data.email;
      this.selectedDays = data.horarios.dias;
      this.start.setValue(data.horarios.inicioSemana);
      this.end.setValue(data.horarios.finSemana);
      this.days = this.selectedDays;
      if (this.days.includes('sabado')) {
        this.startSaturday.setValue(data.horarios.inicioSabado);
        this.endSaturday.setValue(data.horarios.finSabado);
        this.showSaturdayTimePick = true;
      }
    });
  }

  saveTimeSchedule() {
    let horarios;

    if (this.showSaturdayTimePick) {
      horarios = {
        dias: this.selectedDays,
        inicioSemana: this.start.value,
        finSemana: this.end.value,
        inicioSabado: this.startSaturday.value,
        finSabado: this.endSaturday.value,
      };
    } else {
      horarios = {
        dias: this.selectedDays,
        inicioSemana: this.start.value,
        finSemana: this.end.value,
      };
    }

    this.usersService
      .getCurrentUser()
      .then((data: any) => {
        this.currentUser = data.email;
      })
      .then(() => {
        this.usersService.saveDoctorAvailableTime(this.currentUser, horarios);
        this.toastrService.success('Horarios Guardados.', '', {
          positionClass: 'toast-top-center',
        });
        this.router.navigate(['Principal']);
      });
  }

  showSaturdayPick() {
    this.showSaturdayTimePick = !this.showSaturdayTimePick;
  }
}
