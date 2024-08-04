import { Component } from '@angular/core';
import { DoctorPatientFormComponent } from "../doctor-patient-form/doctor-patient-form.component";

@Component({
  selector: 'app-form-doctor',
  standalone: true,
  imports: [DoctorPatientFormComponent],
  templateUrl: './form-doctor.component.html',
  styleUrls: ['./form-doctor.component.scss']
})
export class FormDoctorComponent {


  
}
