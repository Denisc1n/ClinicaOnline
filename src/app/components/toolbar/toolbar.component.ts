import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css'],
})
export class ToolbarComponent implements OnInit {
  @Input() profile;
  constructor(private router: Router) {}

  ngOnInit(): void {}

  home() {
    console.log(this.profile);
    if (this.profile == 'doctor' || this.profile == 'patient') {
      this.router.navigate(['Principal']);
    } else if (this.profile == 'administrator') {
      this.router.navigate(['Administrador']);
    } else {
      // this.router.navigate(['Login']);
    }
  }
}
