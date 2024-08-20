import { Component, inject, OnInit } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { combineLatest, Observable } from 'rxjs';
import { Patient, PatientState } from '../../interfaces/IPatient';
import { Appointment, AppointmentState } from '../../interfaces/IAppointment';
import { AppointmentService } from '../../services/appointment/appointment.service';
import { PatientService } from '../../services/patient/patient.service';
import { DoctorService } from '../../services/doctor/doctor.service';
import { Doctor, DoctorState } from '../../interfaces/IDoctos';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [ChartModule, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  basicData: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor: string[];
      borderColor: string[];
      borderWidth: number;
    }[];
  } = {
      labels: [],
      datasets: [
        {
          label: 'Dataset 1',
          data: [],
          backgroundColor: [],
          borderColor: [],
          borderWidth: 1,

        }
      ]
    }

  lineData: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      fill: boolean;
      borderColor: string;
      tension: number;
    }[];
  } = {
      labels: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
      datasets: [
        {
          label: 'Conjunto de Consultas por Mês',
          data: [],
          fill: true,
          borderColor: '#9966ff',
          tension: 0.4
        }
      ]
    };


  lineOptions: any;
  filaOptions: any;
  basicOptions: any;
  dataLoaded = false;

  appointmentStore = inject(Store<AppointmentState>);
  doctorStore = inject(Store<DoctorState>);
  patientStore = inject(Store<PatientState>);

  doctors$: Observable<Doctor[]>;
  patients$: Observable<Patient[]>;
  appointments$: Observable<Appointment[]>;
  appointmentsMouth$: Observable<number[]>

  constructor(
    private doctorService: DoctorService,
    private patientService: PatientService,
    private appointmentService: AppointmentService
  ) {
    this.appointments$ = this.appointmentStore.select(state => state.appointment.appointments);
    this.appointmentsMouth$ = this.appointmentStore.select(state => state.appointment.appointmentsMonth);
    this.doctors$ = this.doctorStore.select(state => state.doctor.doctors);
    this.patients$ = this.patientStore.select(state => state.patient.patients);
  }

  ngOnInit(): void {
    this.doctorService.getDoctors().subscribe();
    this.patientService.getPatients().subscribe();
    this.appointmentService.getAppointments().subscribe();
    this.appointmentService.getAllMonthAppointments().subscribe();
    this.setData();

  }

  async setData() {

    combineLatest([this.doctors$, this.patients$, this.appointments$])
      .subscribe(([doctors, patients, appointments]) => {

        const data = [doctors.length, patients.length, appointments.length];


        this.basicData = {
          labels: ['Doutores (a)', 'Pacientes', 'Consultas'],
          datasets: [
            {
              label: 'Conjunto de Dados',
              data: data,
              backgroundColor: ['#4df7cf', '#3949ab', '#9966ff'],
              borderColor: ['#4df7cf', '#3949ab', '#9966ff'],
              borderWidth: 1
            }
          ]
        };



        this.appointmentsMouth$.subscribe(data => {
          this.lineData = {
            labels: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
            datasets: [
              {
                label: 'Conjunto de Consultas por Mês',
                data: data,
                fill: true,
                borderColor: '#9966ff',
                tension: 0.4
              }
            ]
          };
        });


        this.basicOptions = {
          plugins: {
            legend: {
              labels: {
                usePointStyle: true,
                color: '#4150a8'
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                color: '#4150a8'
              },
              grid: {
                color: '#e6eaf9',
                drawBorder: false,
                borderColor: '#e6eaf9'
              }
            },
            x: {
              ticks: {
                color: '#4150a8'
              },
              grid: {
                color: '#e6eaf9',
                drawBorder: false,
                borderColor: '#e6eaf9'
              }
            }
          }
        };

        this.lineOptions = {
          maintainAspectRatio: false,
          aspectRatio: 0.6,
          plugins: {
            legend: {
              labels: {
                color: '#4150a8'
              }
            }
          },
          scales: {
            x: {
              ticks: {
                color: '#4150a8'
              },
              grid: {
                color: '#e6eaf9',
                drawBorder: false,
                borderColor: '#e6eaf9'
              }
            },
            y: {
              ticks: {
                color: '#4150a8'
              },
              grid: {
                color: '#e6eaf9',
                drawBorder: false,
                borderColor: '#e6eaf9'
              }
            }
          }
        };

      });
  }

}
