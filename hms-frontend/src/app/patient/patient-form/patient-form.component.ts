import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PatientService } from '../patient.service';

@Component({
  selector: 'app-patient-form',
  templateUrl: './patient-form.component.html'
})
export class PatientFormComponent implements OnInit {
  patient: any = {
    fullName: '',
    dateOfBirth: '',
    gender: ''
  };

  isEditMode = false;
  id: number | null = null;

  constructor(
    private patientService: PatientService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    if (this.id) {
      this.isEditMode = true;
      this.patientService.getPatientById(this.id).subscribe({
        next: (data) => this.patient = data,
        error: (err) => console.error('❌ Failed to load patient', err)
      });
    }
  }

  onSubmit(): void {
    if (this.isEditMode && this.id) {
      this.patientService.updatePatient(this.id, this.patient).subscribe({
        next: () => this.router.navigate(['/patients']),
        error: (err) => console.error('❌ Update failed', err)
      });
    } else {
      this.patientService.createPatient(this.patient).subscribe({
        next: () => this.router.navigate(['/patients']),
        error: (err) => console.error('❌ Create failed', err)
      });
    }
  }
}
