import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { Store } from '@ngrx/store';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { Appointment, AppointmentState } from '../../../interfaces/IAppointment';
import { map, Observable } from 'rxjs';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { InputMaskModule } from 'primeng/inputmask';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { AppointmentService } from '../../../services/appointment/appointment.service';
import { TooltipModule } from 'primeng/tooltip';
import { PatientService } from '../../../services/patient/patient.service';
import { DoctorService } from '../../../services/doctor/doctor.service';
import { Patient } from '../../../interfaces/IPatient';
import { Doctor } from '../../../interfaces/IDoctos';
import { PipesModule } from '../../../pipes.module';

@Component({
  selector: 'app-appointments',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    DialogModule,
    ButtonModule,
    TableModule,
    ToastModule,
    TooltipModule,
    ScrollingModule,
    ReactiveFormsModule,
    FormsModule,
    InputTextModule,
    DropdownModule,
    InputMaskModule,
    InputTextareaModule,
    PipesModule,
  ],
  providers: [MessageService],
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.scss']
})
export class AppointmentsComponent implements OnInit {

  authForm!: FormGroup;
  searchValue: string = '';
  visibleDelete: boolean = false;
  visiblePdf: boolean = false;
  base64Pdf: string | null = null;
  patients: Patient[] = [];
  specialitys: any[] = [];
  doctors: Doctor[] = [];
  fullDoctors: Doctor[] = [];
  hour_date: any = {};
  selectedAppointment: number = 0;
  visibleEdit: boolean = false;
  emptyAppointments: boolean = false;
  appointments$: Observable<Appointment[]>;
  store = inject(Store<AppointmentState>);
  filteredAppointments$: Observable<Appointment[]>;

  //paginação
  pageSize: number = 20;
  total: number = 0
  currentPage: number = 1
  totalPages: number = 0

  constructor(
    private cdr: ChangeDetectorRef,
    private appointmentService: AppointmentService,
    private patientService: PatientService,
    private doctorService: DoctorService,
    private messageService: MessageService) {

    this.appointments$ = this.store.select(state => state.appointment.appointments);
    this.store.subscribe(state => this.totalPages = state.appointment.pagination?.totalPages);
    this.filteredAppointments$ = this.appointments$;

  }

  ngOnInit(): void {

    this.authForm = new FormGroup({
      id: new FormControl('', [Validators.required]),
      patientid: new FormControl('', [Validators.required]),
      hour: new FormControl('', [Validators.required]),
      speciality: new FormControl('', [Validators.required]),
      doctorid: new FormControl([Validators.required]),
      description: new FormControl('', [Validators.required]),
      appointmentdate: new FormControl('', [Validators.required]),
    });

    this.authForm.get('speciality')?.valueChanges.subscribe(value => {
      if (value) {
        this.loadDoctors();
        this.authForm.get('doctorid')?.setValue('');
      }
    });

    this.appointmentService.getAppointments(1, 20).subscribe();
    this.cdr.detectChanges();

  }

  async loadSpecialities(): Promise<void> {
    try {
      const patients = await this.patientService.getPatients().toPromise();
      this.patients = patients.data.patients;
      const speciality = await this.doctorService.getSpeciality().toPromise();
      this.specialitys = speciality.data;
    } catch (error) {
      console.error('Error loading specialities:', error);
    } finally {
      this.cdr.detectChanges();
    }
  }

  async loadDoctors(): Promise<void> {
    this.hour_date = [];
    if (this.authForm.value.speciality) {
      const specialitySearch = await this.doctorService.getSearchSpeciality(this.authForm.value.speciality).toPromise();
      this.fullDoctors = specialitySearch.data.doctors;
      const doctors = specialitySearch.data.doctors;
      const uniqueDoctors = doctors.filter((doctor: any, index: any, self: any) =>
        index === self.findIndex((d: any) => (
          d.name === doctor.name
        ))
      );
      this.doctors = uniqueDoctors;
      this.cdr.detectChanges();
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


  onSearch(value: string): void {
    this.searchValue = value;
    if (value) {
      this.filteredAppointments$ = this.appointments$.pipe(
        map((appointments: any) => appointments.filter((appointment: any) => appointment.doctor.toLowerCase().includes(value.toLowerCase())))
      );
    } else {
      this.filteredAppointments$ = this.appointments$;
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.appointmentService.getAppointments(this.currentPage + 1, this.pageSize).subscribe();
      this.currentPage = this.currentPage + 1
      this.cdr.detectChanges();
    }
  }
  previousPage() {
    if (this.currentPage > 1) {
      this.appointmentService.getAppointments(this.currentPage - 1, this.pageSize).subscribe();
      this.currentPage = this.currentPage - 1
      this.cdr.detectChanges();
    }
  }

  lastPage() {
    this.appointmentService.getAppointments(this.totalPages, this.pageSize).subscribe();
    this.currentPage = this.totalPages
    this.cdr.detectChanges();
  }

  firstPage() {
    this.appointmentService.getAppointments(1, this.pageSize).subscribe();
    this.currentPage = 1
    this.cdr.detectChanges();
  }

  showDialogDelete(appointmentId: number) {
    this.selectedAppointment = appointmentId;
    this.visibleDelete = true;
  }

  showDialogPdf(appointmentId: number, base64Pdf?: string) {

    if (base64Pdf) {
      this.base64Pdf = `data:application/pdf;base64,${base64Pdf}`;
      this.visiblePdf = true;
    }
    this.selectedAppointment = appointmentId;
    this.visiblePdf = true;
  }

  async showDialogEdit(appointment: Appointment) {

    const formattedDate = appointment.appointmentdate ? (() => {
      const [year, month, day] = appointment.appointmentdate.split('T')[0].split('-');
      return `${day}-${month}-${year}`;
    })()
      : '';

    this.authForm.setValue({
      id: appointment.id,
      patientid: appointment.patientid,
      hour: appointment.hour,
      speciality: appointment.speciality,
      doctorid: appointment.doctorid,
      description: appointment.description,
      appointmentdate: formattedDate,
    });

    this.loadDoctors();
    this.loadSpecialities()

    this.visibleEdit = true;
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = () => {
        this.base64Pdf = reader.result as string;
        console.log(this.base64Pdf)
        this.cdr.detectChanges();

      };

      reader.onerror = (error) => {
        console.error('Error reading file:', error);
      };

      reader.readAsDataURL(file);
    }
  }

  cancel() {
    this.visiblePdf = false;
    this.base64Pdf = '';

    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  async onSubmit() {
    try {
      const { speciality: _, ...dataForm } = this.authForm.value;
      const appointment = await this.appointmentService.updateAppointment(dataForm).toPromise();
      this.visibleEdit = false;
      this.messageService.add({ severity: 'success', summary: 'Successo', detail: 'Editado com sucesso!' });
      this.cdr.detectChanges();
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao editar o médico.' });
      this.visibleEdit = false;
      console.error('Erro ao editar:', error);
    }
  }

  async submitPdf() {

    const formatedData = {
      appointmentid: this.selectedAppointment,
      resultpath: this.base64Pdf
    }

    try {
      const result = await this.appointmentService.createResult(formatedData).toPromise();
      this.messageService.add({ severity: 'success', summary: 'Successo', detail: 'Resultado cadastrado com sucesso!' });
      this.visiblePdf = false;
      this.cdr.detectChanges();
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao cadastrar o resultado.' });
      this.visiblePdf = false;
      console.error('Erro ao editar:', error);
    }
  }

  deleteAppointment() {
    if (this.selectedAppointment) {
      try {
        this.appointmentService.deleteAppointment(this.selectedAppointment).subscribe();
        this.messageService.add({ severity: 'success', summary: 'Successo', detail: 'Excluído com sucesso!' });
        this.cdr.detectChanges();
      } catch (error) {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao excluir o agendamento.' });
        console.error('Erro ao excluir:', error);
      }

    }
  }
}
