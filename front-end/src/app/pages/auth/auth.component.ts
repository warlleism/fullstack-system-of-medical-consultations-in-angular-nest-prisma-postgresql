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

    const textField = field === 'email' ? this.email = value : this.password = value;
    const domItem = field === 'email' ? document.getElementById('email') : document.getElementById('password');

    if (domItem) {
      if (this.email.length > 0 || this.password.length > 0) {
        domItem.classList.add('active');
      } else {
        domItem.classList.remove('active');
      }
    }

    console.log(this.email.length, this.password.length)
  }


  onSubmit(form: any) {
    this.isLoading = true;
    this.useService.login(form)
    setTimeout(() => {
      this.isLoading = false;
    }, 2000)
  }
}
