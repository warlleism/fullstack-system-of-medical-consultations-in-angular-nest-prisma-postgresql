import { Routes } from '@angular/router';
import { AuthComponent } from './pages/auth/auth.component';
import { HomeComponent } from './pages/home/home.component';
import { AuthorizationGuard } from './services/auth/auth.guard';
import { FormPatientComponent } from './pages/form-patient/form-patient.component';
import { FormDoctorComponent } from './pages/form-doctor/form-doctor.component';

export const routes: Routes = [
    {
        path: '', redirectTo: 'login', pathMatch: 'full'
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
                path: 'doctor',
                component: FormDoctorComponent,
                canActivate: [AuthorizationGuard]
            },
            {
                path: 'patient',
                component: FormPatientComponent,
                canActivate: [AuthorizationGuard]
            },
        ]
    },
    {
        path: '**',
        redirectTo: 'home',
    },

];
