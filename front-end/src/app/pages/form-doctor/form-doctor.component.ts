import { Component } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { UserService } from '../../services/user/user.service';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-form-doctor',
  standalone: true,
  imports: [
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    MatSelectModule,
    CommonModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ProgressSpinnerModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './form-doctor.component.html',
  styleUrls: ['./form-doctor.component.scss']
})
export class FormDoctorComponent {


  authForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    cpf: new FormControl('', [Validators.required, Validators.minLength(14)]),
    gender: new FormControl('', [Validators.required]),
    birthdate: new FormControl('', [Validators.required]),
    phone: new FormControl('', [Validators.required, Validators.minLength(11)]),
    speciality: new FormControl('', [Validators.required]),
  });
  isLoading: boolean = false;

  constructor(private userService: UserService) { }

  formatPhone(event: any) {
    const input = event.target.value.replace(/\D/g, '');
    const formattedInput = input.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    console.log(formattedInput)
    this.authForm.controls['phone'].setValue(formattedInput);
  }

  formatCPF(event: any) {
    const input = event.target.value.replace(/\D/g, ''); // Remove todos os caracteres não numéricos
    const formattedInput = input.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    console.log(formattedInput);
    this.authForm.controls['cpf'].setValue(formattedInput);
  }
  

  onSubmit(): void {
    this.isLoading = true;
    console.log(this.authForm.value)

    setTimeout(() => {
      this.isLoading = false;
    }, 800)
  }
}
