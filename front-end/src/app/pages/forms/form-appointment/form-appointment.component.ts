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
import { AppointmentService } from '../../../services/appointment/appointment.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { DropdownModule } from 'primeng/dropdown';
import { InputMaskModule } from 'primeng/inputmask';
import { InputTextareaModule } from 'primeng/inputtextarea';

@Component({
  selector: 'app-form-appointment',
  standalone: true,
  imports: [
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    DropdownModule,
    MatSelectModule,
    CommonModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ProgressSpinnerModule,
    MatIconModule,
    MatButtonModule,
    ToastModule,
    InputMaskModule,
    InputTextareaModule
  ],
  providers: [MessageService],
  templateUrl: './form-appointment.component.html',
  styleUrl: './form-appointment.component.scss'
})
export class FormAppointmentComponent {

  authForm!: FormGroup;
  isLoading: boolean = false;
  isLoadingGetDoctors: boolean = false;
  patients: any[] = [];
  specialitys: any[] = [];
  doctors: any[] = [];
  countries: any[] | undefined;

  ngOnInit(): void {
    this.authForm = new FormGroup({
      patientid: new FormControl('', [Validators.required]),
      hour: new FormControl('', [Validators.required]),
      speciality: new FormControl('', [Validators.required]),
      doctorid: new FormControl({ value: '', disabled: true }, [Validators.required]),
      description: new FormControl('', [Validators.required]),
      appointmentdate: new FormControl('', [Validators.required]),
    });

    this.authForm.get('speciality')?.valueChanges.subscribe(value => {
      if (value) {
        this.loadDoctors();
        this.authForm.get('doctorid')?.enable();
      } else {
        this.authForm.get('doctorid')?.disable();
        this.authForm.get('doctorid')?.setValue('');
      }
    });
    

    this.loadSpecialities();
  }

  constructor(
    private appointment: AppointmentService,
    private patientService: PatientService,
    private doctorService: DoctorService,
    private cdr: ChangeDetectorRef,
    private messageService: MessageService
  ) { }

  isDoctorDropdownDisabled(): boolean {
    const control = this.authForm.get('doctorid');
    return control ? control.disabled : true;
  }

  async loadSpecialities(): Promise<void> {
    try {
      const patients = await this.patientService.getPatients().toPromise();
      const speciality = await this.doctorService.getSpeciality().toPromise();
      this.patients = patients.data.patients;
      this.specialitys = speciality.data;
    } catch (error) {
      console.error('Error loading specialities:', error);
    } finally {
      this.isLoadingGetDoctors = false;
      this.cdr.detectChanges();
    }
  }

  async loadDoctors(): Promise<void> {
    if (this.authForm.value.speciality) {
      this.isLoadingGetDoctors = true;
      setTimeout(async () => {
        const specialitySearch = await this.doctorService.getSearchSpeciality(this.authForm.value.speciality).toPromise();
        this.doctors = specialitySearch.data;
        this.isLoadingGetDoctors = false;
        this.cdr.detectChanges();
      }, 700)
    }
  }

  async onSubmit() {

    if (this.authForm.invalid) {
      this.messageService.add({ severity: 'error', summary: 'Faltam Campos', detail: 'Preencha todos os campos.' });
      return
    }
    
    this.isLoading = true;
    try {
      const appointment = { ...this.authForm.value };
      const appointments = await this.appointment.createAppointment(appointment).toPromise();
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
