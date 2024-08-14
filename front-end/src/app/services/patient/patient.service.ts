import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { createPatient, deletePatient, getAllPatients, updatePatient } from '../../store/actions/counter.actions';
import { Store } from '@ngrx/store';
import { Patient } from '../../interfaces/IPatient';

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
          const errorMessage = err.error?.error;
          this.router.navigateByUrl("login")
        }
      })
    );
  }

  createPatient(patient: any): Observable<any> {
    const url = 'http://localhost:3000/patient/create';
    return this.http.post<any>(url, patient).pipe(
      tap({
        next: (res: any) => {
          this.store.dispatch(createPatient({ patient: res.data }))
        },
        error: (err: any) => {
          const errorMessage = err.error?.error;
          alert(errorMessage)
        }
      })
    );
  }

  updatePatient(patient: Patient): Observable<any> {
    const url = 'http://localhost:3000/patient/update';
    return this.http.patch<any>(url, patient).pipe(
      tap({
        next: (res: any) => {
          this.store.dispatch(updatePatient({ patient: res.data }))
        },
        error: (err: any) => {
          const errorMessage = err.error?.error;
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
          const errorMessage = err.error?.error;
          alert(errorMessage)
        }
      })
    );
  }
}
