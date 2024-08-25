import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private url = 'http://localhost:3000/auth/login'

  constructor(private http: HttpClient, private router: Router) { }

  login(form: any) {
    this.http.post('http://localhost:3000/auth/login', form).subscribe({
      next: (res: any) => {
        localStorage.setItem('token', res.token)

        setTimeout(()=>{
          localStorage.setItem('link', "/home/dashboard");
          this.router.navigateByUrl("/home/dashboard")
        },1000)
      },
      error: (err: any) => {
        const errorMessage = err.error?.error || 'Usuário não autorizado!';
        alert(errorMessage);
      }
    });
  }

}
