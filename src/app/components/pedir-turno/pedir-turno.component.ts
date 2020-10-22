import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';

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
  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.dataService.getProfesionales().then((datos) => {
      this.doctors = datos;
    });
    this.dataService.getTodasEspecialidades().then((datos) => {
      this.practices = datos;
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
}
