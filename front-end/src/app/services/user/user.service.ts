import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private url = 'http://localhost:3000/auth/login'

  constructor(private http: HttpClient) { }

  login(form: any) {
    this.http.post('http://localhost:3000/auth/login', form.value).subscribe({
      next: (res: any) => {
        if (res.statusCode === 201) {
          alert('Usuário autorizado com sucesso!');
        }
      },
      error: (err: any) => {
        console.log(err)
        const errorMessage = err.error?.error || 'Usuário não autorizado!';
        alert(errorMessage);
      }
    });
  }

}
