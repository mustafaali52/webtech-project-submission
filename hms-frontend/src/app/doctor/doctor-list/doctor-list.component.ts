import { Component, OnInit } from '@angular/core';
import { DoctorService, Doctor } from '../doctor.service';

@Component({
  selector: 'app-doctor-list',
  templateUrl: './doctor-list.component.html'
})
export class DoctorListComponent implements OnInit {
  doctors: Doctor[] = [];
  userRole: string = '';

  constructor(private doctorService: DoctorService) {}

  ngOnInit(): void {
    this.userRole = localStorage.getItem('role') || '';
    this.fetchDoctors();
  }

  fetchDoctors() {
    this.doctorService.getAllDoctors().subscribe({
      next: (data) => this.doctors = data,
      error: (err) => console.error('❌ Failed to fetch doctors', err)
    });
  }

  deleteDoctor(id: number) {
    if (confirm('Are you sure you want to delete this doctor?')) {
      this.doctorService.deleteDoctor(id).subscribe({
        next: () => this.fetchDoctors(),
        error: (err) => console.error('❌ Delete failed', err)
      });
    }
  }
}
