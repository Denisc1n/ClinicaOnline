import { Directive, ElementRef, Input, AfterViewInit } from '@angular/core';

@Directive({
  selector: '[changeStatusColor]',
})
export class ChangeColorDirective {
  constructor(private elementRef: ElementRef) {}

  color: string;

  @Input() set changeStatusColor(status: string) {
    if (status == 'Completo') {
      this.color = 'green';
    } else if (status == 'Cancelado') {
      this.color = 'red';
    } else if (status == 'Pendiente') {
      this.color = 'gray';
    }
  }

  ngAfterViewInit(): void {
    this.elementRef.nativeElement.style.backgroundColor = this.color;
    this.elementRef.nativeElement.style.color = 'white';
    this.elementRef.nativeElement.style.textTransform = 'uppercase';
    // this.elementRef.nativeElement.style.fontSize = '1.5rem';
  }
}
