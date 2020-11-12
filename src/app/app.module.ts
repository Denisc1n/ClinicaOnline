import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { environment } from '../environments/environment';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSort } from '@angular/material/sort';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { MatNativeDateModule } from '@angular/material/core';
import 'hammerjs';
import { ToastrModule } from 'ngx-toastr';
import { AuthenticationService } from './services/authentication.service';
import { PrincipalComponent } from './components/principal/principal.component';
import { AuthGuardService } from './guards/auth-guard.service';
import { RegistroGeneralComponent } from './components/registro-general/registro-general.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MaterialFileInputModule } from 'ngx-material-file-input';
import { RecaptchaFormsModule, RecaptchaModule } from 'ng-recaptcha';
import { UsersService } from './services/users.service';
import { DataService } from './services/data.service';
import { PedirTurnoComponent } from './components/pedir-turno/pedir-turno.component';
import { IsActivePipe } from './pipes/is-active.pipe';
import { PrincipalAdministradorComponent } from './components/principal-administrador/principal-administrador.component';
import { RegistroAdministradorComponent } from './components/registro-administrador/registro-administrador.component';
import { AltaProfesionalesComponent } from './components/alta-profesionales/alta-profesionales.component';
import { MatTableModule } from '@angular/material/table';
import { HorariosDoctorComponent } from './components/horarios-doctor/horarios-doctor.component';
import { DatePipe } from '@angular/common';
import { SummaryModalComponent } from './components/principal/summary-modal/summary-modal.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MedicalHistoryComponent } from './components/principal/medical-history/medical-history.component';
import { BuscarTurnosComponent } from './components/buscar-turnos/buscar-turnos.component';
import { SelectPracticeComponent } from './components/principal/select-practice/select-practice.component';
import { DiaDeLaFechaPipe } from './pipes/dia-de-la-fecha.pipe';
import { ChangeColorDirective } from './directives/change-color.directive';
import { CancelarTurnoComponent } from './components/principal/cancelar-turno/cancelar-turno.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ToolbarComponent,
    PrincipalComponent,
    RegistroGeneralComponent,
    PedirTurnoComponent,
    IsActivePipe,
    PrincipalAdministradorComponent,
    RegistroAdministradorComponent,
    AltaProfesionalesComponent,
    HorariosDoctorComponent,
    SummaryModalComponent,
    MedicalHistoryComponent,
    BuscarTurnosComponent,
    SelectPracticeComponent,
    DiaDeLaFechaPipe,
    ChangeColorDirective,
    CancelarTurnoComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireStorageModule,
    MatCardModule,
    MatButtonModule,
    MatMenuModule,
    MatToolbarModule,
    MatIconModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    AngularFireAuthModule,
    ToastrModule.forRoot({}),
    NgbModule,
    RecaptchaModule,
    RecaptchaFormsModule,
    MaterialFileInputModule,
    MatSelectModule,
    MatTableModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDialogModule,
  ],
  exports: [MatFormFieldModule, MatInputModule],
  providers: [
    AuthenticationService,
    AuthGuardService,
    UsersService,
    DataService,
    MatDatepickerModule,
    MatNativeDateModule,
    DatePipe,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
