import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { forEachChild } from 'typescript';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-buscar-turnos',
  templateUrl: './buscar-turnos.component.html',
  styleUrls: ['./buscar-turnos.component.css'],
})
export class BuscarTurnosComponent implements OnInit {
  constructor(private dataService: DataService) {}
  @Output() emitHideTable: EventEmitter<any> = new EventEmitter<any>();
  showHome = true;
  showLogout = true;
  profile = 'administrator';
  hidden = true;
  turnosEncontrados = [];

  auxAppointments: any[] = [];
  stringClave: string;
  selectedAppointment: any;
  @ViewChild(MatSort) sort: MatSort;
  showDetails = false;
  appointmentsLoaded = false;
  @Input() appointments;
  days = [
    'Domingo',
    'Lunes',
    'Martes',
    'Miercoles',
    'Jueves',
    'Viernes',
    'Sabado',
  ];

  displayedColumns = [
    { def: 'doctorName', hide: false },
    { def: 'patientName', hide: false },
    { def: 'date', hide: false },
    { def: 'time', hide: false },
    { def: 'dato_edad', hide: false },
    { def: 'dato_peso', hide: false },
    { def: 'dato_temperatura', hide: false },
    { def: 'dato_presion', hide: false },
  ];
  ngOnInit(): void {}

  ngAfterViewInit() {}

  // filtrarTurnos() {
  //   this.turnosEncontrados = [];
  //   this.stringClave = this.stringClave.trim().toLocaleLowerCase();
  //   if (this.stringClave.length > 0) {
  //     for (let turno of this.appointments) {
  //       if (
  //         turno.nombrePaciente.toLowerCase().includes(this.stringClave) ||
  //         turno.nombreProfesional.toLowerCase().includes(this.stringClave) ||
  //         turno.especialidad.toLowerCase().includes(this.stringClave) ||
  //         turno.estado.includes(this.stringClave) ||
  //         turno.fecha.includes(this.stringClave)
  //       ) {
  //         this.turnosEncontrados.push(turno);
  //       } else {
  //         if (turno.datos != undefined) {
  //           for (let item of Object.keys(turno.datos)) {
  //             if (item.includes(this.stringClave))
  //               this.turnosEncontrados.push(turno);
  //           }
  //         }
  //       }
  //     }
  //   }
  // }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    // this.appointments.filter = filterValue.trim().toLowerCase();
  }

  selectAppointment(element) {
    this.selectedAppointment = element;
    this.showDetails = true;
  }
  getDisplayedColumns(): string[] {
    return this.displayedColumns.filter((cd) => !cd.hide).map((cd) => cd.def);
  }

  cambioFiltro(e) {
    if (!this.appointmentsLoaded && this.appointments.length > 0) {
      this.auxAppointments = this.appointments;
      this.appointmentsLoaded = true;
    }
    this.appointments = this.auxAppointments.filter((turno: any) => {
      // let year = Number.parseInt(
      //   turno.fecha[0] + turno.fecha[1] + turno.fecha[2] + turno.fecha[3]
      // );
      // let month = Number.parseInt(turno.fecha[5] + turno.fecha[6]);
      // month = month - 1;
      // let day = Number.parseInt(turno.fecha[8] + turno.fecha[9]);
      let fecha = new Date(turno.date);
      let dia = this.days[fecha.getDay()];
      if (dia.toLowerCase().includes(e.target.value.toLowerCase())) {
        return turno;
      }

      if (turno.date.toLowerCase().includes(e.target.value.toLowerCase())) {
        return turno;
      }

      if (turno.practice.toLowerCase().includes(e.target.value.toLowerCase())) {
        return turno;
      }

      if (turno.status.toLowerCase().includes(e.target.value.toLowerCase())) {
        return turno;
      }

      if (
        turno.patientName.toLowerCase().includes(e.target.value.toLowerCase())
      ) {
        return turno;
      }

      if (
        turno.doctorName.toLowerCase().includes(e.target.value.toLowerCase())
      ) {
        return turno;
      }

      if (
        turno.Edad?.toString()
          .toLowerCase()
          .includes(e.target.value.toLowerCase())
      ) {
        return turno;
      }

      if (
        turno['TemperaturaCorporal']
          ?.toString()
          .toLowerCase()
          .includes(e.target.value.toLowerCase())
      ) {
        return turno;
      }

      if (
        turno.Presion?.toString()
          .toLowerCase()
          .includes(e.target.value.toLowerCase())
      ) {
        return turno;
      }

      if (
        turno.CampoDinamico0?.name
          .toString()
          .toLowerCase()
          .includes(e.target.value.toLowerCase()) ||
        turno.CampoDinamico0?.value
          .toString()
          .toLowerCase()
          .includes(e.target.value.toLowerCase())
      ) {
        return turno;
      }
      if (
        turno.CampoDinamico1?.name
          .toString()
          .toLowerCase()
          .includes(e.target.value.toLowerCase()) ||
        turno.CampoDinamico1?.value
          .toString()
          .toLowerCase()
          .includes(e.target.value.toLowerCase())
      ) {
        return turno;
      }
      if (
        turno.CampoDinamico2?.name
          .toString()
          .toLowerCase()
          .includes(e.target.value.toLowerCase()) ||
        turno.CampoDinamico2?.name
          .toString()
          .toLowerCase()
          .includes(e.target.value.toLowerCase())
      ) {
        return turno;
      }
    });
    if (this.appointments.length == 0) {
      if (e.target.value == '') {
        this.appointments = this.auxAppointments;
      }
    }
  }

  goBack() {
    this.emitHideTable.emit('hide');
  }
}
