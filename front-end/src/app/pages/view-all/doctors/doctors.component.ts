import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { DoctorService } from '../../../services/doctor/doctor.service';
import { MatTableModule } from '@angular/material/table';
import { Store } from '@ngrx/store';
import { Doctor } from '../../../store/actions/counter.actions';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-doctors',
  standalone: true,
  imports: [MatIconModule, CommonModule, MatTableModule],
  templateUrl: './doctors.component.html',
  styleUrls: ['./doctors.component.scss']
})
export class DoctorsComponent implements OnInit {

  doctorDataSource = new MatTableDataSource<Doctor>();
  private store = inject(Store);

  constructor(private doctorService: DoctorService, private cdr: ChangeDetectorRef) {
    this.store.select('doctor').subscribe((doctors) => {
      this.doctorDataSource.data = doctors[0] ?? [];
    });
  }

  displayedColumns: string[] = ['name', 'speciality', 'cpf', 'gender', 'birthdate', 'phone', 'actions'];

  ngOnInit(): void {
    this.doctorService.getDoctors().subscribe(res => {
      this.cdr.detectChanges();
    });
  }
}
