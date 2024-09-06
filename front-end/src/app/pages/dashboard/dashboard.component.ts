import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../../services/dashboard/dashboard.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [ChartModule, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  basicData: any = {
    labels: [],
    datasets: [{
      label: 'Dataset 1',
      data: [],
      backgroundColor: [],
      borderColor: [],
      borderWidth: 1,
    }]
  };

  lineData: any = {
    labels: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
    datasets: [{
      label: 'Conjunto de Consultas por Mês',
      data: [],
      fill: true,
      borderColor: '#9966ff',
      tension: 0.4
    }]
  };

  lineOptions: any;
  basicOptions: any;

  constructor(private dashboardService: DashboardService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.dashboardService.getAllMonthAppointments().subscribe((data: any) => {

      this.basicData = {
        labels: ['Pacientes', 'Doutores(as)', 'Consultas'],
        datasets: [{
          label: 'Quantidade de Cadastros Atuais',
          data: data.data.result || [],
          backgroundColor: ['#4df7cf', '#3949ab', '#9966ff'],
          borderColor: ['#4df7cf', '#3949ab', '#9966ff'],
          borderWidth: 1
        }]
      };

      this.lineData = {
        labels: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
        datasets: [{
          label: 'Conjunto de Consultas por Mês',
          data: data.data.appointmentsPerMonth || [],
          fill: true,
          borderColor: '#9966ff',
          tension: 0.4
        }]
      };

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

      this.cdr.detectChanges();
    });
  }
}
