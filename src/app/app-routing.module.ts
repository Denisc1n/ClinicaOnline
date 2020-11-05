import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AltaProfesionalesComponent } from './components/alta-profesionales/alta-profesionales.component';
import { HorariosDoctorComponent } from './components/horarios-doctor/horarios-doctor.component';
import { LoginComponent } from './components/login/login.component';
import { PedirTurnoComponent } from './components/pedir-turno/pedir-turno.component';
import { PrincipalAdministradorComponent } from './components/principal-administrador/principal-administrador.component';
import { PrincipalComponent } from './components/principal/principal.component';
import { RegistroAdministradorComponent } from './components/registro-administrador/registro-administrador.component';
import { RegistroGeneralComponent } from './components/registro-general/registro-general.component';
import { AuthGuardService } from './guards/auth-guard.service';

const routes: Routes = [
  { path: '', component: LoginComponent },
  {
    path: 'Login',
    component: LoginComponent,
    data: { animation: 'Login' },
  },
  {
    path: 'Principal',
    component: PrincipalComponent,
    canActivate: [AuthGuardService],
    data: { animation: 'Principal' },
  },
  {
    path: 'Administrador',
    component: PrincipalAdministradorComponent,
    canActivate: [AuthGuardService],
    data: { animation: 'Administrador' },
  },
  {
    path: 'Registrar-admin',
    component: RegistroAdministradorComponent,
    canActivate: [AuthGuardService],
    data: { animation: 'Registrar-admin' },
  },
  {
    path: 'Registro',
    component: RegistroGeneralComponent,
    data: { animation: 'Registro' },
  },
  {
    path: 'Pedir-turno',
    component: PedirTurnoComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'Alta-profesionales',
    component: AltaProfesionalesComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'Administrar-horarios',
    component: HorariosDoctorComponent,
    canActivate: [AuthGuardService],
    data: { animation: 'Administrar-horarios' },
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
