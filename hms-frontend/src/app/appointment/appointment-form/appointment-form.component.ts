import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppointmentService, Appointment } from '../appointment.service';
import { DoctorService, Doctor } from 'src/app/doctor/doctor.service';
import { PatientService, Patient } from 'src/app/patient/patient.service';

@Component({
  selector: 'app-appointment-form',
  templateUrl: './appointment-form.component.html'
})
export class AppointmentFormComponent implements OnInit {
  appointment: Appointment = {
    appointmentDate: '',
    patientId: 0,
    doctorId: 0
  };

  doctors: Doctor[] = [];
  patients: Patient[] = [];
  isEdit = false;
  appointmentId?: number;

  constructor(
    private appointmentService: AppointmentService,
    private doctorService: DoctorService,
    private patientService: PatientService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchDoctors();
    this.fetchPatients();

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.appointmentId = +id;
        this.isEdit = true;

        this.appointmentService.getAppointmentById(this.appointmentId).subscribe({
          next: (data) => this.appointment = data,
          error: (err) => console.error('❌ Failed to load appointment', err)
        });
      }
    });
  }

  fetchDoctors(): void {
    this.doctorService.getAllDoctors().subscribe({
      next: (data) => this.doctors = data,
      error: (err) => console.error('❌ Doctor load error', err)
    });
  }

  fetchPatients(): void {
    this.patientService.getAll().subscribe({
      next: (data) => this.patients = data,
      error: (err) => console.error('❌ Patient load error', err)
    });
  }

  onSubmit(): void {
    if (this.isEdit && this.appointmentId !== undefined) {
      this.appointmentService.updateAppointment(this.appointmentId, this.appointment).subscribe({
        next: () => {
          console.log('✅ Appointment updated');
          this.router.navigate(['/appointments']);
        },
        error: (err) => console.error('❌ Update failed', err)
      });
    } else {
      this.appointmentService.createAppointment(this.appointment).subscribe({
        next: () => {
          console.log('✅ Appointment created');
          this.router.navigate(['/appointments']);
        },
        error: (err) => console.error('❌ Create failed', err)
      });
    }
  }
}
