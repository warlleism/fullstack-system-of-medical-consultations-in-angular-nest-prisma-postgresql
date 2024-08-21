
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { Store } from '@ngrx/store';
import { createAppointment, createResult, deleteAppointment, getAllAppointments, updateAppointment } from '../../store/actions/counter.actions';
import { Appointment } from '../../interfaces/IAppointment';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {

  private store = inject(Store)

  constructor(private http: HttpClient, private router: Router) { }

  getAppointments(page?: number, pageSize?: number): Observable<any> {
    const pagination = page && pageSize ? `page=${page}&pageSize=${pageSize}` : '';
    const url = `http://localhost:3000/appointment/getAll?${pagination}`;
    return this.http.get<any>(url).pipe(
      tap({
        next: (res: any) => {
          this.store.dispatch(getAllAppointments({ appointments: res.data.appointments, pagination: res.data.pagination }))
        },
        error: (err: any) => {
          const errorMessage = err.error?.error || 'Usuário não autorizado!';
          this.router.navigateByUrl("login")
        }
      })
    );
  }

  createAppointment(appointment: any): Observable<any> {
    const url = 'http://localhost:3000/appointment/create';
    return this.http.post<any>(url, appointment).pipe(
      tap({
        next: (res: any) => {
          this.store.dispatch(createAppointment({ appointment: res.data }))
        },
        error: (err: any) => {
          const errorMessage = err.error?.error || 'Usuário não autorizado!';
        }
      })
    );
  }

  updateAppointment(appointment: Appointment): Observable<any> {
    const url = 'http://localhost:3000/appointment/update';
    return this.http.patch<any>(url, appointment).pipe(
      tap({
        next: (res: any) => {
          this.store.dispatch(updateAppointment({ appointment: res.data[0] }))
        },
        error: (err: any) => {
          const errorMessage = err.error?.error || 'Usuário não autorizado!';
        }
      })
    );
  }

  deleteAppointment(id: number) {
    const url = `http://localhost:3000/appointment/delete/${id}`;
    return this.http.delete<any>(url).pipe(
      tap({
        next: (res: any) => {
          this.store.dispatch(deleteAppointment({ id: id }))
        },
        error: (err: any) => {
          const errorMessage = err.error?.error || 'Usuário não autorizado!';
        }
      })
    );
  }

  createResult(result: any): Observable<any> {
    const url = 'http://localhost:3000/result/create';

    console.log(result)
    return this.http.post<any>(url, result).pipe(
      tap({
        next: (res: any) => {
          this.store.dispatch(createResult({ result: res.data }))
        },
        error: (err: any) => {
          const errorMessage = err.error?.error || 'Usuário não autorizado!';
        }
      })
    );
  }

}
