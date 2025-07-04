import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DoctorService, Doctor } from '../doctor.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-doctor-form',
  templateUrl: './doctor-form.component.html'
})
export class DoctorFormComponent implements OnInit {
  doctorForm!: FormGroup;
  isEditMode = false;
  doctorId!: number;

  constructor(
    private fb: FormBuilder,
    private doctorService: DoctorService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.doctorForm = this.fb.group({
      name: ['', Validators.required],
      specialization: ['', Validators.required],
      contactNumber: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      email: ['', [Validators.required, Validators.email]]
    });

    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam) {
        this.isEditMode = true;
        this.doctorId = +idParam;
        this.loadDoctor(this.doctorId);
      }
    });
  }

  loadDoctor(id: number) {
    this.doctorService.getDoctorById(id).subscribe({
      next: (doctor) => this.doctorForm.patchValue(doctor),
      error: (err) => console.error('Error loading doctor:', err)
    });
  }

  onSubmit() {
    if (this.doctorForm.invalid) return;

    const doctorData: Doctor = this.doctorForm.value;

    if (this.isEditMode) {
      this.doctorService.updateDoctor(this.doctorId, doctorData).subscribe({
        next: () => {
          alert('✅ Doctor updated');
          this.router.navigate(['/doctors']);
        },
        error: (err) => {
          console.error('Update failed', err);
          alert('❌ Update failed');
        }
      });
    } else {
      this.doctorService.createDoctor(doctorData).subscribe({
        next: () => {
          alert('✅ Doctor created');
          this.router.navigate(['/doctors']);
        },
        error: (err) => {
          console.error('Create failed', err);
          alert('❌ Create failed');
        }
      });
    }
  }
}
