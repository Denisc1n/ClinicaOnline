import { Component, Input, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.css'],
})
export class PrincipalComponent implements OnInit {
  showHome = true;
  profile = 'patient';
  showLogout = true;

  public currentUser;

  constructor(
    private userService: UsersService,
    private fireAuth: AngularFireAuth
  ) {
    this.userService.getCurrentUser().then((data) => (this.currentUser = data));
  }

  ngOnInit(): void {}
}
