import { Component, Input, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css'],
})
export class ToolbarComponent implements OnInit {
  @Input() profile;
  @Input() showHomeButton;
  @Input() showLogout = false;
  constructor(private router: Router, private fireAuth: AngularFireAuth) {}

  ngOnInit(): void {}

  home() {
    if (this.profile == 'doctor' || this.profile == 'patient') {
      this.router.navigate(['Principal']);
    } else if (this.profile == 'administrator') {
      this.router.navigate(['Administrador']);
    } else {
      this.router.navigate(['Login']);
    }
  }

  logout() {
    this.fireAuth.signOut();
    this.router.navigate(['Login']);
  }
}
