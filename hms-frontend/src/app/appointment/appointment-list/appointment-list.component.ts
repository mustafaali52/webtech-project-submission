import { Component, OnInit } from '@angular/core';
import { AppointmentService, Appointment } from '../appointment.service';

@Component({
  selector: 'app-appointment-list',
  templateUrl: './appointment-list.component.html'
})
export class AppointmentListComponent implements OnInit {
  appointments: Appointment[] = [];
  userRole: string = '';

  constructor(private appointmentService: AppointmentService) {}

  ngOnInit(): void {
    this.userRole = localStorage.getItem('role') || '';
    this.loadAppointments();
  }

  loadAppointments(): void {
    this.appointmentService.getAllAppointments().subscribe({
      next: (data) => this.appointments = data,
      error: (err) => console.error('❌ Failed to fetch appointments', err)
    });
  }

  deleteAppointment(id: number): void {
    if (this.userRole !== 'Admin') {
      alert('❌ Only admins can delete appointments.');
      return;
    }

    if (confirm('Are you sure you want to delete this appointment?')) {
      this.appointmentService.deleteAppointment(id).subscribe({
        next: () => this.loadAppointments(),
        error: (err) => console.error('❌ Delete failed', err)
      });
    }
  }
}
