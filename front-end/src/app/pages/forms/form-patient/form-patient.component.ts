import { Component } from '@angular/core';
import { DoctorPatientFormComponent } from '../doctor-patient-form/doctor-patient-form.component';

@Component({
  selector: 'app-form-patient',
  standalone: true,
  imports: [
    DoctorPatientFormComponent
  ],
  templateUrl: './form-patient.component.html',
  styleUrl: './form-patient.component.scss'
})
export class FormPatientComponent {

}
