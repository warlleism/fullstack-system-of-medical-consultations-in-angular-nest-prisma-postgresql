import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { UserService } from '../../services/user/user.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})

export class AuthComponent implements OnInit {

  authForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(3)])
  });
  isLoading: boolean = false;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.authForm.get('email')?.valueChanges.subscribe(() => this.onInputChange());
    this.authForm.get('password')?.valueChanges.subscribe(() => this.onInputChange());
  }

  onInputChange() {
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');

    if (emailInput) {
      this.authForm.controls['email'].value.trim().length > 0 ? emailInput.classList.add('active') : emailInput.classList.remove('active');
    }
    if (passwordInput) {
      this.authForm.controls['password'].value.trim().length > 0 ? passwordInput.classList.add('active') : passwordInput.classList.remove('active');
    }
  }

  onSubmit(): void {
    this.isLoading = true;
    this.userService.login(this.authForm.value)

    setTimeout(() => {
      this.isLoading = false;
    }, 800)
  }

}

