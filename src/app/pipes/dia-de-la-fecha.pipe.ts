import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'diaDeLaFecha',
})
export class DiaDeLaFechaPipe implements PipeTransform {
  dias = [
    'Domingo',
    'Lunes',
    'Martes',
    'Miercoles',
    'Jueves',
    'Viernes',
    'Sabado',
  ];

  // transform(lista: any[], ...args: unknown[]): unknown {
  //   let control: Boolean = false;
  //   do {
  //     console.log(lista);
  //     lista.forEach((element) => {
  //       let fecha = new Date(element.date);
  //       element.dia = this.dias[fecha.getDay()];
  //       element.dia = 'Lunes';
  //     });
  //     // let year = Number.parseInt(
  //     //   turno.fecha[0] + turno.fecha[1] + turno.fecha[2] + turno.fecha[3]
  //     // );
  //     // let month = Number.parseInt(turno.fecha[5] + turno.fecha[6]);
  //     // month = month - 1;
  //     // let day = Number.parseInt(turno.fecha[8] + turno.fecha[9]);
  //     return lista;
  //   } while (!control);
  // }

  transform(lista: any, ...args: unknown[]): unknown {
    if (lista?.length > 0) {
      for (const turno of lista) {
        let fecha = new Date(turno.date);
        turno.dia = this.dias[fecha.getDay()];
      }
    }
    return lista;
  }
}
