import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private url = 'http://localhost:3000/auth/login'

  constructor(private http: HttpClient) { }

  login(email: string, password: string) {
    return this.http.post(this.url, { email, password })
  }
}
