import { Component, Input } from '@angular/core';
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
import { ChangeDetectorRef } from '@angular/core';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DoctorService } from '../../services/doctor/doctor.service';

@Component({
  selector: 'app-doctor-patient-form',
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
  templateUrl: './doctor-patient-form.component.html',
  styleUrl: './doctor-patient-form.component.scss'
})
export class DoctorPatientFormComponent {

  @Input() userType: 'doctor' | 'patient' = 'doctor';

  authForm!: FormGroup;
  isLoading: boolean = false;
  isLoadingGetDoctors: boolean = false;
  doctors: any[] = [];

  ngOnInit(): void {
    this.authForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      cpf: new FormControl('', [Validators.required, Validators.minLength(14)]),
      gender: new FormControl('', [Validators.required, Validators.minLength(14)]),
      birthdate: new FormControl('', [Validators.required]),
      phone: new FormControl('', [Validators.required, Validators.minLength(11)]),
      speciality: this.userType === 'doctor' ? new FormControl('', [Validators.required]) : new FormControl('')
    });

    this.loadSpecialities();
  }

  constructor(private doctorService: DoctorService, private cdr: ChangeDetectorRef) { }

  async loadSpecialities(): Promise<void> {
    this.isLoadingGetDoctors = true;
    try {
      const doctors = await this.doctorService.getSpeciality().toPromise();
      this.doctors = doctors.data;
    } catch (error) {
      console.error('Error loading specialities:', error);
    } finally {
      this.isLoadingGetDoctors = false;
      this.cdr.detectChanges();  
    }
  }

  formatPhone(event: any) {
    const input = event.target.value.replace(/\D/g, '');
    const formattedInput = input.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    this.authForm.controls['phone'].setValue(formattedInput);
  }

  formatCPF(event: any) {
    const input = event.target.value.replace(/\D/g, '');
    const formattedInput = input.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    this.authForm.controls['cpf'].setValue(formattedInput);
  }


  async getDoctors() {
    try {
      const doctors = await this.doctorService.getSearchSpeciality('dermatologia').toPromise();
      this.doctors = doctors.data;
    } catch (error) {
      setTimeout(() => {
        this.isLoading = false;
      }, 800);
    } finally {
      setTimeout(() => {
        this.isLoading = false;
      }, 800);
    }
  }

  async onSubmit() {
    try {
      const doctors = await this.doctorService.getSpeciality().toPromise();
      this.doctors = doctors.data;
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        this.isLoading = false;
      }, 800);
    }
  }

}
