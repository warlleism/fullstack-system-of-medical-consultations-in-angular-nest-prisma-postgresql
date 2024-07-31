import { Routes } from '@angular/router';
import { AuthComponent } from './pages/auth/auth.component';
import { HomeComponent } from './pages/home/home.component';
import { AuthorizationGuard } from './services/auth/auth.guard';

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
        canActivate: [AuthorizationGuard]
    },
    {
        path: '**',
        redirectTo: 'home',
    },

];
