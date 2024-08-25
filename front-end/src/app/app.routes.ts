import { Routes } from '@angular/router';
import { AuthComponent } from './pages/auth/auth.component';
import { HomeComponent } from './pages/home/home.component';
import { AuthorizationGuard } from './services/auth/auth.guard';
import { DoctorsComponent } from './pages/view-all/doctors/doctors.component';
import { FormPatientComponent } from './pages/forms/form-patient/form-patient.component';
import { FormDoctorComponent } from './pages/forms/form-doctor/form-doctor.component';
import { FormAppointmentComponent } from './pages/forms/form-appointment/form-appointment.component';
import { PatientsComponent } from './pages/view-all/patients/patients.component';
import { AppointmentsComponent } from './pages/view-all/appointments/appointments.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';

export const routes: Routes = [
    {
        path: '', redirectTo: '/home/dashboard', pathMatch: 'full'
    },
    {
        path: 'login',
        component: AuthComponent
    },
    {
        path: 'home',
        component: HomeComponent,
        canActivate: [AuthorizationGuard],
        children: [
            {
                path: 'dashboard',
                component: DashboardComponent,
                canActivate: [AuthorizationGuard]
            },
            {
                path: 'appointment',
                component: FormAppointmentComponent,
                canActivate: [AuthorizationGuard]
            },
            {
                path: 'doctor',
                component: FormDoctorComponent,
                canActivate: [AuthorizationGuard]
            },
            {
                path: 'patient',
                component: FormPatientComponent,
                canActivate: [AuthorizationGuard]
            },
            {
                path: 'view/all/doctors',
                component: DoctorsComponent,
                canActivate: [AuthorizationGuard]
            },
            {
                path: 'view/all/patients',
                component: PatientsComponent,
                canActivate: [AuthorizationGuard]
            },
            {
                path: 'view/all/appointment',
                component: AppointmentsComponent,
                canActivate: [AuthorizationGuard]
            }
        ]
    },
];
