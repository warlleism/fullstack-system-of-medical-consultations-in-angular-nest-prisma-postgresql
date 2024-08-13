import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { createPatient, deletePatient, getAllPatients } from '../../store/actions/counter.actions';
import { Store } from '@ngrx/store';

@Injectable({
  providedIn: 'root'
})
export class PatientService {

  private store = inject(Store)

  constructor(private http: HttpClient, private router: Router) { }

  getPatients(page?: number, pageSize?: number): Observable<any> {
    const pagination = page && pageSize ? `page=${page}&pageSize=${pageSize}` : '';
    const url = `http://localhost:3000/patient/getAll?${pagination}`;
    return this.http.get<any>(url).pipe(
      tap({
        next: (res: any) => {
          this.store.dispatch(getAllPatients({ patients: res.data.patients, pagination: res.data.pagination }))
        },
        error: (err: any) => {
          const errorMessage = err.error?.error || 'Usuário não autorizado!';
          this.router.navigateByUrl("login")
        }
      })
    );
  }

  createDoctor(doctor: any): Observable<any> {
    const url = 'http://localhost:3000/patient/create';
    return this.http.post<any>(url, doctor).pipe(
      tap({
        next: (res: any) => {
          this.store.dispatch(createPatient({ patient: res.data }))
        },
        error: (err: any) => {
          const errorMessage = err.error?.error || 'Usuário não autorizado!';
          alert(errorMessage)
        }
      })
    );
  }

  deletePatient(id: number) {
    const url = `http://localhost:3000/patient/delete/${id}`;
    return this.http.delete<any>(url).pipe(
      tap({
        next: (res: any) => {
          this.store.dispatch(deletePatient({ id: id }))
        },
        error: (err: any) => {
          const errorMessage = err.error?.error || 'Usuário não autorizado!';
          alert(errorMessage)
        }
      })
    );
  }
}
