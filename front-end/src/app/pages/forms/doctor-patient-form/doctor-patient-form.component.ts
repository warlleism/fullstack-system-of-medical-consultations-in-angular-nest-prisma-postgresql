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
import { DoctorService } from '../../../services/doctor/doctor.service';
import { PatientService } from '../../../services/patient/patient.service';

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
      gender: new FormControl('', [Validators.required]),
      birthdate: new FormControl('', [Validators.required]),
      phone: new FormControl('', [Validators.required, Validators.minLength(11)]),
      speciality: this.userType === 'doctor' ? new FormControl('', [Validators.required]) : new FormControl('')
    });
  }

  constructor(private patientService: PatientService, private doctorService: DoctorService, private cdr: ChangeDetectorRef) { }

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


  async onSubmit() {
    this.isLoading = true;

    try {
      const birthdate = new Date(this.authForm.value.birthdate);
      const day = ("0" + birthdate.getDate()).slice(-2);
      const month = ("0" + (birthdate.getMonth() + 1)).slice(-2);
      const year = birthdate.getFullYear();
      const formattedDate = `${day}-${month}-${year}`;

      const data = {
        ...this.authForm.value,
        birthdate: formattedDate,
        name: this.userType === 'doctor' ? `Dr(a) ${this.authForm.value.name}` : this.authForm.value.name,
      };
      if (this.userType === 'doctor') {
        const doctors = await this.doctorService.createDoctor(data).toPromise();
      } else {
        const { speciality: _, ...dataForm } = data;
        const patient = await this.patientService.createDoctor(dataForm).toPromise();
      }


    } catch (error) {
      this.isLoading = false;
      this.cdr.detectChanges();
    } finally {
      this.isLoading = false;
      this.cdr.detectChanges();
    }
  }


}
