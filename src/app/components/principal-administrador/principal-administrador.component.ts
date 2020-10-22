import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-principal-administrador',
  templateUrl: './principal-administrador.component.html',
  styleUrls: ['./principal-administrador.component.css'],
})
export class PrincipalAdministradorComponent implements OnInit {
  profile = 'administrator';
  showHome = true;
  showLogout = true;
  constructor() {}

  ngOnInit(): void {}
}
