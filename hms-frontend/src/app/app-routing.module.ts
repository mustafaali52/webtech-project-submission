import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';
import { AuthGuard } from './shared/guards/auth.guard';
import { RoleGuard } from './shared/guards/role.guard'; // ✅

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },

  {
  path: 'doctors',
  loadChildren: () =>
    import('./doctor/doctor.module').then(m => m.DoctorModule),
  canActivate: [AuthGuard] // ✅ Allow all authenticated users
  },

  {
  path: 'patients',
  loadChildren: () =>
    import('./patient/patient.module').then(m => m.PatientModule),
  canActivate: [AuthGuard] // ✅ Allow all authenticated users
  },
  
  {
    path: 'appointments',
    loadChildren: () =>
      import('./appointment/appointment.module').then(m => m.AppointmentModule),
    canActivate: [AuthGuard] // ✅ No RoleGuard — allow both roles
  },

  { path: 'unauthorized', component: UnauthorizedComponent },
  { path: '**', redirectTo: '/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
