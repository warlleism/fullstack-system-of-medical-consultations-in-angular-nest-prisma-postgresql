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
import { ChangeDetectorRef } from '@angular/core';
import { DoctorService } from '../../../services/doctor/doctor.service';
import { PatientService } from '../../../services/patient/patient.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { DropdownModule } from 'primeng/dropdown';
import { InputMaskModule } from 'primeng/inputmask';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputTextModule } from 'primeng/inputtext';

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
    MatIconModule,
    ToastModule,
    DropdownModule,
    InputMaskModule,
    InputTextareaModule,
    InputTextModule
  ],
  providers: [MessageService],
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

  constructor(
    private patientService: PatientService,
    private doctorService: DoctorService,
    private cdr: ChangeDetectorRef,
    private messageService: MessageService
  ) { }


  clearForm() {
    this.authForm.reset();
  }

  async onSubmit() {

    if (this.authForm.invalid) {
      this.messageService.add({ severity: 'error', summary: 'Faltam Campos', detail: 'Preencha todos os campos.' });
      return
    }

    this.isLoading = true;

    try {

      const data = {
        ...this.authForm.value,
        name: this.authForm.value.gender === 'masculino' ? ` ${this.userType === 'doctor' ? 'Dr.' : ''} ${this.authForm.value.name}` : ` ${this.userType === 'doctor' ? 'Dra.' : ''} ${this.authForm.value.name}`,
      };

      if (this.userType === 'doctor') {
        const doctors = await this.doctorService.createDoctor(data).toPromise();
      } else {
        const { speciality: _, ...dataForm } = data;
        const patient = await this.patientService.createPatient(dataForm).toPromise();
      }

      this.messageService.add({ severity: 'success', summary: 'Successo', detail: 'Cadastro feito com sucesso!' });
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Ocorreu algum erro!' });
    } finally {
      this.isLoading = false;
      this.cdr.detectChanges();
      this.authForm.reset();
    }
  }

}
