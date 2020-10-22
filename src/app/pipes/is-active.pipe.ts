import { Pipe, PipeTransform } from '@angular/core';
import { forEachChild } from 'typescript';

@Pipe({
  name: 'isActive',
})
export class IsActivePipe implements PipeTransform {
  transform(value: unknown, ...args: unknown[]): unknown {
    try {
      let doctorList = [];
      for (let item of <any>value) {
        if (item.activo) {
          doctorList.push(item);
        }
      }
      doctorList.sort((a, b) => a.apellido.localeCompare(b.apellido));
      return doctorList;
    } catch (error) {}
  }
}
