
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { createDoctor } from '../../store/actions/counter.actions';
import { Store } from '@ngrx/store';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {

  private store = inject(Store)

  constructor(private http: HttpClient, private router: Router) { }

  getPatients(): Observable<any> {
    const url = 'http://localhost:3000/appointment/getAll';
    return this.http.get<any>(url).pipe(
      tap({
        next: (res: any) => {
          this.store.dispatch(createDoctor({ doctor: res.data.doctors }))
        },
        error: (err: any) => {
          const errorMessage = err.error?.error || 'Usuário não autorizado!';
          this.router.navigateByUrl("login")
        }
      })
    );
  }

  createAppointment(doctor: any): Observable<any> {
    const url = 'http://localhost:3000/appointment/create';
    return this.http.post<any>(url, doctor).pipe(
      tap({
        next: (res: any) => {
          console.log(res)
        },
        error: (err: any) => {
          const errorMessage = err.error?.error || 'Usuário não autorizado!';
          alert(errorMessage)
        }
      })
    );
  }
}
