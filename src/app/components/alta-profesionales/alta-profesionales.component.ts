import { Component, OnInit } from '@angular/core';
import { timingSafeEqual } from 'crypto';
import { ToastrService } from 'ngx-toastr';
import { DataService } from '../../services/data.service';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-alta-profesionales',
  templateUrl: './alta-profesionales.component.html',
  styleUrls: ['./alta-profesionales.component.css'],
})
export class AltaProfesionalesComponent implements OnInit {
  showHome = true;
  showLogout = true;
  profile = 'administrator';

  displayedColumns: string[] = [
    'name',
    'lastName',
    'email',
    'practices',
    'actions',
  ];

  public doctors: any;
  constructor(
    private dataService: DataService,
    private usersService: UsersService,
    private toastr: ToastrService
  ) {
    this.dataService.getPendingApprovalDoctors().then((data) => {
      this.doctors = data;
    });
  }

  ngOnInit(): void {}

  activateUser(doctor) {
    try {
      this.usersService.activateDoctorAccount(doctor.email);
      this.toastr.success('Doctor habilitado para operar la plataforma');
      this.dataService.getPendingApprovalDoctors().then((data) => {
        this.doctors = data;
      });
    } catch (error) {
      this.toastr.error('Error al habilitar el doctor');
    }
  }
}
