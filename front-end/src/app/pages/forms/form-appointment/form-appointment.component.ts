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
import { ChangeDetectorRef } from '@angular/core';
import { DoctorService } from '../../../services/doctor/doctor.service';
import { PatientService } from '../../../services/patient/patient.service';
import { AppointmentService } from '../../../services/appointment/appointment.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { DropdownModule } from 'primeng/dropdown';
import { InputMaskModule } from 'primeng/inputmask';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ScrollerModule } from 'primeng/scroller';
import { debounceTime, switchMap } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-form-appointment',
  standalone: true,
  imports: [
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    DropdownModule,
    ScrollerModule,
    MatSelectModule,
    CommonModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatButtonModule,
    ToastModule,
    InputMaskModule,
    InputTextareaModule,
  ],
  providers: [MessageService],
  templateUrl: './form-appointment.component.html',
  styleUrl: './form-appointment.component.scss'
})
export class FormAppointmentComponent {

  authForm!: FormGroup;
  isLoading: boolean = false;
  patientIsLoading: boolean = false;
  isLoadingGetDoctors: boolean = false;
  patients: any[] = [];
  specialitys: any[] = [];
  doctors: any[] = [];
  fullDoctors: any[] = [];
  hour_date: any = {};
  filterSubject = new Subject<string>();

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

    this.filterSubject.pipe(
      debounceTime(500),
      switchMap(filter => this.patientService.getSearchPatient(filter).toPromise())
    ).subscribe(patients => {
      if (patients == null) {
        this.patientIsLoading = false
        this.cdr.detectChanges();
      } else {
        this.patients = patients.data;
        this.patientIsLoading = false
        this.cdr.detectChanges();
      }
    });
  }

  constructor(
    private appointment: AppointmentService,
    private patientService: PatientService,
    private doctorService: DoctorService,
    private cdr: ChangeDetectorRef,
    private messageService: MessageService
  ) { }

  onFilter(event: any): void {
    const filterValue = event.filter?.trim();
    const firstWordUppercase = filterValue?.charAt(0).toUpperCase() + filterValue?.slice(1).toLowerCase();
    if (filterValue) {
      this.patientIsLoading = true;
      this.filterSubject.next(firstWordUppercase);
    } else {
      this.patientIsLoading = false;
      this.patients = [];
    }
  }

  async loadSpecialities(): Promise<void> {
    try {
      const speciality = await this.doctorService.getSpeciality().toPromise();
      this.specialitys = speciality.data;
    } catch (error) {
      console.error('Error loading specialities:', error);
    } finally {
      this.isLoadingGetDoctors = false;
      this.cdr.detectChanges();
    }
  }

  async loadDoctors(): Promise<void> {
    this.hour_date = [];

    if (this.authForm.value.speciality) {
      this.isLoadingGetDoctors = true;

      setTimeout(async () => {
        const specialitySearch = await this.doctorService.getSearchSpeciality(this.authForm.value.speciality).toPromise();
        this.fullDoctors = specialitySearch.data.doctors;
        const doctors = specialitySearch.data.doctors;

        const uniqueDoctors = doctors.filter((doctor: any, index: any, self: any) =>
          index === self.findIndex((d: any) => (
            d.name === doctor.name
          ))
        );

        this.doctors = uniqueDoctors;
        this.isLoadingGetDoctors = false;
        this.cdr.detectChanges();
      }, 700);
    }
  }

  getHours() {
    const id = this.authForm.get('doctorid')?.value;
    const filter = this.fullDoctors.filter((doctor: any) => doctor.doctor_id === id && doctor.date !== null);

    if (filter.length > 0) {
      this.hour_date = filter.map((doctor: any) => ({
        date: doctor?.date?.split('T')[0].split('-')?.reverse()?.join('/'),
        hour: doctor?.hour
      }));

    } else {
      console.warn('No doctors found with the given id.');
      this.hour_date = [];
    }
  }


  clearForm() {
    this.patients = []
    this.authForm.reset();
  }

  async onSubmit() {

    if (this.authForm.invalid) {
      this.messageService.add({ severity: 'error', summary: 'Faltam Campos', detail: 'Faltam campos a serem preenchidos' });
      return
    }

    const dateHourInclude = this.hour_date.find((hour: any) => hour.date === this.authForm.value.appointmentdate && hour.hour === this.authForm.value.hour);

    if (dateHourInclude) {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Horário indisponível!' });
      return
    }

    this.isLoading = true;
    try {

      const { speciality: _, ...dataForm } = this.authForm.value;
      const spliceDate = dataForm.appointmentdate.split('/');
      dataForm.appointmentdate = `${spliceDate[0]}-${spliceDate[1]}-${spliceDate[2]}`;
      const appointments = await this.appointment.createAppointment(dataForm).toPromise();
      this.messageService.add({ severity: 'success', summary: 'Successo', detail: 'Cadastro feito com sucesso!' });
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Ocorreu algum erro!' });
    } finally {
      this.isLoading = false;
      this.cdr.detectChanges();
      this.hour_date = [];
      this.authForm.reset();
    }
  }

}
