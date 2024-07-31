import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { UserService } from '../../services/user/user.service';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    ProgressSpinnerModule
  ],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss'
})

export class AuthComponent {

  email: string = '';
  password: string = '';
  isLoading: boolean = false;

  constructor(private useService: UserService) { }

  onInputChange(value: string, field: string) {

    const setValue = field === 'email' ? this.email = value : this.password = value
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');

    if (emailInput) {
      this.email.trim().length > 0 ? emailInput.classList.add('active') : emailInput.classList.remove('active');
    }

    if (passwordInput) {
      this.password.trim().length > 0 ? passwordInput.classList.add('active') : passwordInput.classList.remove('active');
    }
  }



  onSubmit(form: any) {
    this.isLoading = true;
    this.useService.login(form)
    setTimeout(() => {
      this.isLoading = false;
    }, 2000)
  }
}
