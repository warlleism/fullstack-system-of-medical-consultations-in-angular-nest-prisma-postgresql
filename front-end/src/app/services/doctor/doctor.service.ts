import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { deleteDoctor, getAllDoctors, createDoctor, updateDoctor } from '../../store/actions/counter.actions';
import { Store } from '@ngrx/store';
import { Doctor } from '../../interfaces/IDoctos';

@Injectable({
  providedIn: 'root'
})
export class DoctorService {

  private store = inject(Store)

  constructor(private http: HttpClient, private router: Router) { }

  getDoctors(page?: number, pageSize?: number): Observable<any> {
    const pagination = page && pageSize ? `page=${page}&pageSize=${pageSize}` : '';
    const url = `http://localhost:3000/doctor/getAll?${pagination}`;
    return this.http.get<any>(url).pipe(
      tap({
        next: (res: any) => {
          this.store.dispatch(getAllDoctors({ doctors: res.data.doctors, pagination: res.data.pagination }))
        },
        error: (err: any) => {
          const errorMessage = err.error?.error || 'Usuário não autorizado!';
          this.router.navigateByUrl("login")
        }
      })
    );
  }

  createDoctor(doctor: any): Observable<any> {
    const url = 'http://localhost:3000/doctor/create';
    return this.http.post<any>(url, doctor).pipe(
      tap({
        next: (res: any) => {
          this.store.dispatch(createDoctor({ doctor: res.data }))
        },
        error: (err: any) => {
          const errorMessage = err.error?.error || 'Usuário não autorizado!';
          alert(errorMessage)
        }
      })
    );
  }

  updateDoctor(doctor: Doctor): Observable<any> {
    const url = 'http://localhost:3000/doctor/update';
    return this.http.patch<any>(url, doctor).pipe(
      tap({
        next: (res: any) => {
          this.store.dispatch(updateDoctor({ doctor: res.data }))
        },
        error: (err: any) => {
          const errorMessage = err.error?.error || 'Usuário não autorizado!';
        }
      })
    );
  }

  getSearchSpeciality(search: string): Observable<any> {
    const url = `http://localhost:3000/doctor/getSearch/${search}`;

    return this.http.get<any>(url).pipe(
      tap({
        next: (res: any) => { },
        error: (err: any) => {
        }
      })
    );
  }

  getSpeciality(): Observable<any> {
    const url = 'http://localhost:3000/doctor/getAllSpeciality';
    return this.http.get<any>(url).pipe(
      tap({
        next: (res: any) => { },
        error: (err: any) => {
          const errorMessage = err.error?.error || 'Usuário não autorizado!';
          this.router.navigateByUrl("login")
        }
      })
    );
  }

  deleteDoctor(id: number) {
    const url = `http://localhost:3000/doctor/delete/${id}`;
    return this.http.delete<any>(url).pipe(
      tap({
        next: (res: any) => {
          this.store.dispatch(deleteDoctor({ id: id }))
        },
        error: (err: any) => {
          const errorMessage = err.error?.error || 'Usuário não autorizado!';
          alert(errorMessage)
        }
      })
    );
  }

}
