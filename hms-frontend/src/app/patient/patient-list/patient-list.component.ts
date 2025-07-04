import { Component, OnInit } from '@angular/core';
import { PatientService, Patient } from '../patient.service';

@Component({
  selector: 'app-patient-list',
  templateUrl: './patient-list.component.html'
})
export class PatientListComponent implements OnInit {
  patients: Patient[] = [];
  userRole: string = '';

  constructor(private patientService: PatientService) {}

  ngOnInit(): void {
    this.userRole = localStorage.getItem('role') || '';
    this.loadPatients();
  }

  loadPatients() {
    this.patientService.getAll().subscribe({
      next: (data) => this.patients = data,
      error: (err) => console.error('❌ Failed to fetch patients', err)
    });
  }

  deletePatient(id?: number) {
    if (!id || this.userRole !== 'Admin') return;

    if (confirm('Delete this patient?')) {
      this.patientService.delete(id).subscribe({
        next: () => this.loadPatients(),
        error: (err) => console.error('❌ Delete failed', err)
      });
    }
  }
}
