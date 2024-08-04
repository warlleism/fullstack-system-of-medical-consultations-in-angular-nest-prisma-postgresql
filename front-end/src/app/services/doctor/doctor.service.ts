import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DoctorService {


  constructor(private http: HttpClient, private router: Router) { }

  getSearchSpeciality(search: string): Observable<any> {
    const url = `http://localhost:3000/doctor/getSearch/${search}`;
    return this.http.get<any>(url).pipe(
      tap({
        next: (res: any) => {
        },
        error: (err: any) => {
          const errorMessage = err.error?.error || 'Usuário não autorizado!';
          alert(errorMessage);
        }
      })
    );
  }

  getSpeciality(): Observable<any> {
    const url = 'http://localhost:3000/doctor/getAllSpeciality';
    return this.http.get<any>(url).pipe(
      tap({
        next: (res: any) => {
        },
        error: (err: any) => {
          const errorMessage = err.error?.error || 'Usuário não autorizado!';
          alert(errorMessage);
        }
      })
    );
  }

}
