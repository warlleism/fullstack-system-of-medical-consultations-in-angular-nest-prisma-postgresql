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
import { provideAnimations } from '@angular/platform-browser/animations';


@Component({
  selector: 'app-form-appointment',
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
    ToastModule,
  ],
  providers: [MessageService, provideAnimations()],
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

  ngOnInit(): void {
    this.authForm = new FormGroup({
      patientid: new FormControl('', [Validators.required]),
      speciality: new FormControl('', [Validators.required]),
      doctorid: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      appointmentdate: new FormControl('', [Validators.required]),
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

  show() {
    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Message Content' });
  }

  async onSubmit() {

    this.isLoading = true;
    this.messageService.add({ severity: 'success', summary: 'Consulta', detail: 'Cadastro feito com sucesso!' });

    try {
      const appointmentdate = new Date(this.authForm.value.appointmentdate);
      const day = ("0" + appointmentdate.getDate()).slice(-2);
      const month = ("0" + (appointmentdate.getMonth() + 1)).slice(-2);
      const year = appointmentdate.getFullYear();
      const formattedDate = `${day}-${month}-${year}`;

      const appointment = {
        ...this.authForm.value,
        appointmentdate: formattedDate,
      };
      const { speciality: _, ...dataForm } = appointment;
      const appointments = await this.appointment.createAppointment(dataForm).toPromise();
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Cadastro feito com sucesso!' });

    } catch (error) {
      this.isLoading = false;
      this.cdr.detectChanges();
    } finally {
      this.isLoading = false;
      this.cdr.detectChanges();

    }
  }


}
