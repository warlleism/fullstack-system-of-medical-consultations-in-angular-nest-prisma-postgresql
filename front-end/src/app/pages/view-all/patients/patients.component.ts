import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { PatientService } from '../../../services/patient/patient.service';
import { MatTableModule } from '@angular/material/table';
import { Store } from '@ngrx/store';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { Patient, PatientState } from '../../../interfaces/IPatient';
import { map, Observable } from 'rxjs';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { InputMaskModule } from 'primeng/inputmask';
import { InputTextareaModule } from 'primeng/inputtextarea';

@Component({
  selector: 'app-patients',
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
  templateUrl: './patients.component.html',
  styleUrls: ['./patients.component.scss']
})
export class PatientsComponent implements OnInit {

  authForm!: FormGroup;
  searchValue: string = '';
  visible: boolean = false;
  selectedPatient: number = 0;
  visibleEdit: boolean = false;
  emptyPatients: boolean = false;
  patients$: Observable<Patient[]>;
  store = inject(Store<PatientState>);
  filteredPatients$: Observable<Patient[]>;

  //paginação
  pageSize: number = 20;
  total: number = 0
  currentPage: number = 1
  totalPages: number = 0

  constructor(
    private patientService: PatientService,
    private cdr: ChangeDetectorRef,
    private messageService: MessageService) {
    this.patients$ = this.store.select(state => state.patient.patients);
    this.filteredPatients$ = this.patients$;
    this.store.subscribe(state => this.totalPages = state.patient.pagination?.totalPages);
  }

  ngOnInit(): void {

    this.authForm = new FormGroup({
      id: new FormControl(''),
      name: new FormControl('', [Validators.required]),
      cpf: new FormControl('', [Validators.required, Validators.minLength(14)]),
      gender: new FormControl('', [Validators.required]),
      birthdate: new FormControl('', [Validators.required]),
      phone: new FormControl('', [Validators.required, Validators.minLength(11)]),
    });

    this.patientService.getPatients(1, 20).subscribe();
    this.cdr.detectChanges();
  }

  onSearch(value: string): void {
    this.searchValue = value;
    if (value) {
      this.filteredPatients$ = this.patients$.pipe(map((patients: any) => patients.filter((patient: any) => patient.name.toLowerCase().includes(value.toLowerCase())))
      );
    } else {
      this.filteredPatients$ = this.patients$;
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.patientService.getPatients(this.currentPage + 1, this.pageSize).subscribe();
      this.currentPage = this.currentPage + 1
      this.cdr.detectChanges();
    }
  }
  previousPage() {
    if (this.currentPage > 1) {
      this.patientService.getPatients(this.currentPage - 1, this.pageSize).subscribe();
      this.currentPage = this.currentPage - 1
      this.cdr.detectChanges();
    }
  }

  lastPage() {
    this.patientService.getPatients(this.totalPages, this.pageSize).subscribe();
    this.currentPage = this.totalPages
    this.cdr.detectChanges();
  }

  firstPage() {
    this.patientService.getPatients(1, this.pageSize).subscribe();
    this.currentPage = 1
    this.cdr.detectChanges();
  }

  showDialog(patientId: number) {
    this.selectedPatient = patientId;
    this.visible = true;
  }

  async showDialogEdit(patient: Patient) {

    const formattedBirthdate = patient.birthdate ? (() => {
      const [year, month, day] = patient.birthdate.split('T')[0].split('-');
      return `${day}-${month}-${year}`;
    })()
      : '';

    this.authForm.setValue({
      id: patient.id || '',
      name: patient.name || '',
      cpf: patient.cpf || '',
      gender: patient.gender || '',
      birthdate: formattedBirthdate || '',
      phone: patient.phone || '',
    });

    this.visibleEdit = true;

  }

  async onSubmit() {
    try {
      const patient = await this.patientService.updatePatient(this.authForm.value).toPromise();
      this.visibleEdit = false;
      this.messageService.add({ severity: 'success', summary: 'Successo', detail: 'Editado com sucesso!' });
      this.cdr.detectChanges();
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao editar o médico.' });
      console.error('Erro ao editar:', error);
    }
  }

  deletePatient() {
    if (this.selectedPatient) {
      this.messageService.add({ severity: 'success', summary: 'Successo', detail: 'Excluído com sucesso!' });
      this.patientService.deletePatient(this.selectedPatient).subscribe();
      this.cdr.detectChanges();

    }
  }
}
