import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { DoctorService } from '../../../services/doctor/doctor.service';
import { MatTableModule } from '@angular/material/table';
import { Store } from '@ngrx/store';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { map, Observable } from 'rxjs';
import { Doctor, DoctorState } from '../../../interfaces/IDoctos';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { FormsModule } from '@angular/forms';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { InputTextModule } from 'primeng/inputtext';

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
    FormsModule,
    ScrollingModule,
    InputTextModule
  ],
  providers: [MessageService],
  templateUrl: './doctors.component.html',
  styleUrls: ['./doctors.component.scss']
})
export class DoctorsComponent implements OnInit {

  searchValue: string = '';
  store = inject(Store<DoctorState>);
  visible: boolean = false;
  selectedDoctor: number = 0;
  emptyDoctors: boolean = false
  doctors$: Observable<Doctor[]>;
  filteredDoctors$: Observable<Doctor[]>;
  pagination$: Observable<{ total: number; page: number; pageSize: number; totalPages: number }>;

  constructor(private doctorService: DoctorService, private cdr: ChangeDetectorRef, private messageService: MessageService) {
    this.doctors$ = this.store.select(state => state.doctor.doctors);
    this.pagination$ = this.store.select(state => state.doctor.pagination);
    this.filteredDoctors$ = this.doctors$;
  }

  ngOnInit(): void {
    this.doctorService.getDoctors().subscribe();
    this.cdr.detectChanges();
  }

  onSearch(value: string): void {
    this.searchValue = value;
    if (value) {
      const filter = this.filteredDoctors$ = this.doctors$.pipe(
        map((doctors: any) => doctors.filter((doctor: any) => doctor.name.toLowerCase().includes(value.toLowerCase())))
      );
      const isEmpty = filter.subscribe(res => res.length)
      this.emptyDoctors = isEmpty ? true : false
    } else {
      this.filteredDoctors$ = this.doctors$;
      this.emptyDoctors = false
    }
  }
  showDialog(doctor: number) {
    this.selectedDoctor = doctor;
    this.visible = true;
  }

  deleteDoctor() {
    if (this.selectedDoctor) {
      this.messageService.add({ severity: 'success', summary: 'Successo', detail: 'Excluído com sucesso!' });
      this.doctorService.deleteDoctor(this.selectedDoctor).subscribe();
    }
  }
}
