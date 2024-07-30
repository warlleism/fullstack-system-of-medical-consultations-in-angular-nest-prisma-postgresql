import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss'
})

export class AuthComponent {

  constructor(private http: HttpClient) { }

  onSubmit(form: any) {
    try {
      this.http.post('http://localhost:3000/auth/login', form.value).subscribe((res: any) => {
        if (res.statusCode == 201) {
          alert('Usuario autorizado com sucesso!');
        }
      });
    } catch (error) {
      alert('Usuario não autorizado !');
    }
  }

}
