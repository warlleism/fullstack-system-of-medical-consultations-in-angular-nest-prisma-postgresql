import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorPatientFormComponent } from './doctor-patient-form.component';

describe('DoctorPatientFormComponent', () => {
  let component: DoctorPatientFormComponent;
  let fixture: ComponentFixture<DoctorPatientFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DoctorPatientFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DoctorPatientFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
