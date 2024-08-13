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
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';

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
    FormsModule,
    InputTextModule
  ],
  providers: [MessageService],
  templateUrl: './patients.component.html',
  styleUrls: ['./patients.component.scss']
})
export class PatientsComponent implements OnInit {

  searchValue: string = '';
  visible: boolean = false;
  selectedPatient: number = 0;
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

    this.store.subscribe(state => {
      // this.total = state.patient.pagination?.total
      // this.pageSize = state.patient.pagination?.pageSize
      // this.currentPage = state.patient.pagination?.page
      this.totalPages = state.patient.pagination?.totalPages
      // console.log(state.patient.pagination)
    });

  }

  ngOnInit(): void {
    this.patientService.getPatients(1, 20).subscribe();
    this.cdr.detectChanges();
  }

  onSearch(value: string): void {
    this.searchValue = value;
    if (value) {
      this.filteredPatients$ = this.patients$.pipe(
        map((patients: any) => patients.filter((patient: any) => patient.name.toLowerCase().includes(value.toLowerCase())))
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

  deletePatient() {
    if (this.selectedPatient) {
      this.messageService.add({ severity: 'success', summary: 'Successo', detail: 'Excluído com sucesso!' });
      this.patientService.deletePatient(this.selectedPatient).subscribe();
    }
  }
}
