import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-employee-create',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './employee-create.component.html',
  styleUrl: './employee-create.component.css'
})
export class EmployeeCreateComponent {
  employee = {
    fullName: '',
    email: '',
    jobTitle: '',
    salary: 0,
    departmentId: 0
  };
  departments: any[] = [];

  constructor(private http: HttpClient, private router: Router) {
    this.fetchDepartments();
  }

  fetchDepartments() {
    this.http.get<any[]>(`${environment.apiUrl}/Department`).subscribe({
      next: data => this.departments = data,
      error: () => console.error('Could not load departments')
    });
  }

  createEmployee() {
    this.http.post(`${environment.apiUrl}/Employee`, this.employee).subscribe({
      next: () => this.router.navigate(['/employees']),
      error: () => alert('Failed to create employee')
    });
  }
}