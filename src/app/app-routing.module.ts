import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AltaProfesionalesComponent } from './components/alta-profesionales/alta-profesionales.component';
import { LoginComponent } from './components/login/login.component';
import { PedirTurnoComponent } from './components/pedir-turno/pedir-turno.component';
import { PrincipalAdministradorComponent } from './components/principal-administrador/principal-administrador.component';
import { PrincipalComponent } from './components/principal/principal.component';
import { RegistroAdministradorComponent } from './components/registro-administrador/registro-administrador.component';
import { RegistroGeneralComponent } from './components/registro-general/registro-general.component';
import { AuthGuardService } from './guards/auth-guard.service';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'Login', component: LoginComponent },
  {
    path: 'Principal',
    component: PrincipalComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'Administrador',
    component: PrincipalAdministradorComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'Registrar-admin',
    component: RegistroAdministradorComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'Registro',
    component: RegistroGeneralComponent,
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
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
