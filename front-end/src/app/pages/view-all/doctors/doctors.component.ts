import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { Store } from '@ngrx/store';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { map, Observable } from 'rxjs';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { FormGroup, FormControl, FormsModule, Validators, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { Doctor, DoctorState } from '../../../interfaces/IDoctos';
import { DoctorService } from '../../../services/doctor/doctor.service';
import { DropdownModule } from 'primeng/dropdown';
import { InputMaskModule } from 'primeng/inputmask';
import { InputTextareaModule } from 'primeng/inputtextarea';

@Component({
  selector: 'app-doctors',
  standalone: true,
  imports: [
    MatIconModule,
    CommonModule,
    MatTableModule,
    DialogModule,
    ButtonModule,
    TableModule,
    ToastModule,
    ScrollingModule,
    ReactiveFormsModule,
    FormsModule,
    InputTextModule,
    DropdownModule,
    InputMaskModule,
    InputTextareaModule,
  ],
  providers: [MessageService],
  templateUrl: './doctors.component.html',
  styleUrls: ['./doctors.component.scss']
})
export class DoctorsComponent implements OnInit {

  authForm!: FormGroup;
  searchValue: string = '';
  visible: boolean = false;
  selectedDoctor: number = 0;
  visibleEdit: boolean = false;
  emptyDoctors: boolean = false;
  doctors$: Observable<Doctor[]>;
  store = inject(Store<DoctorState>);
  filteredDoctors$: Observable<Doctor[]>;

  //paginação
  pageSize: number = 20;
  total: number = 0
  currentPage: number = 1
  totalPages: number = 0

  constructor(
    private doctorService: DoctorService,
    private cdr: ChangeDetectorRef,
    private messageService: MessageService) {
    this.doctors$ = this.store.select(state => state.doctor.doctors);
    this.filteredDoctors$ = this.doctors$;
    this.store.subscribe(state => {
      this.totalPages = state.doctor.pagination?.totalPages
    });

  }

  ngOnInit(): void {

    this.authForm = new FormGroup({
      id: new FormControl(''),
      name: new FormControl('', [Validators.required]),
      cpf: new FormControl('', [Validators.required, Validators.minLength(14)]),
      gender: new FormControl('', [Validators.required]),
      birthdate: new FormControl('', [Validators.required]),
      phone: new FormControl('', [Validators.required, Validators.minLength(11)]),
      speciality: new FormControl('', [Validators.required])
    });

    this.doctorService.getDoctors(1, 20).subscribe();
    this.cdr.detectChanges();
  }

  onSearch(value: string): void {
    this.searchValue = value;
    if (value) {
      this.filteredDoctors$ = this.doctors$.pipe(
        map((doctors: any) => doctors.filter((doctor: any) => doctor.name.toLowerCase().includes(value.toLowerCase())))
      );
    } else {
      this.filteredDoctors$ = this.doctors$;
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.doctorService.getDoctors(this.currentPage + 1, this.pageSize).subscribe();
      this.currentPage = this.currentPage + 1
      this.cdr.detectChanges();
    }
  }
  previousPage() {
    if (this.currentPage > 1) {
      this.doctorService.getDoctors(this.currentPage - 1, this.pageSize).subscribe();
      this.currentPage = this.currentPage - 1
      this.cdr.detectChanges();
    }
  }

  lastPage() {
    this.doctorService.getDoctors(this.totalPages, this.pageSize).subscribe();
    this.currentPage = this.totalPages
    this.cdr.detectChanges();
  }

  firstPage() {
    this.doctorService.getDoctors(1, this.pageSize).subscribe();
    this.currentPage = 1
    this.cdr.detectChanges();
  }

  showDialog(doctorId: number) {
    this.selectedDoctor = doctorId;
    this.visible = true;
  }

  async showDialogEdit(doctor: Doctor) {

    const formattedBirthdate = doctor.birthdate ? (() => {
      const [year, month, day] = doctor.birthdate.split('T')[0].split('-');
      return `${day}-${month}-${year}`;
    })()
      : '';

    this.authForm.setValue({
      id: doctor.id || '',
      name: doctor.name || '',
      cpf: doctor.cpf || '',
      gender: doctor.gender || '',
      birthdate: formattedBirthdate || '',
      phone: doctor.phone || '',
      speciality: doctor.speciality || ''
    });

    this.visibleEdit = true;

  }
  
  async onSubmit() {
    try {
      const doctors = await this.doctorService.updateDoctor(this.authForm.value).toPromise();
      this.visibleEdit = false;
      this.messageService.add({ severity: 'success', summary: 'Successo', detail: 'Editado com sucesso!' });
      this.cdr.detectChanges();
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao editar o médico.' });
      console.error('Erro ao editar:', error);
    }
  }


  deleteDoctor() {
    if (this.selectedDoctor) {
      this.messageService.add({ severity: 'success', summary: 'Successo', detail: 'Excluído com sucesso!' });
      this.doctorService.deleteDoctor(this.selectedDoctor).subscribe();
      this.cdr.detectChanges();

    }
  }
}
