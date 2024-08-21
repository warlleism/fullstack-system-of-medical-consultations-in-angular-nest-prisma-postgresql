import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private http: HttpClient, private router: Router) { }

  getAllMonthAppointments(): Observable<any> {
    const url = `http://localhost:3000/appointment/getAllMonthAppointments`;
    return this.http.get<any>(url).pipe(
      tap({
        error: (err: any) => {
          const errorMessage = err.error?.error || 'Usuário não autorizado!';
          this.router.navigateByUrl("login")
        }
      })
    );
  }
}
