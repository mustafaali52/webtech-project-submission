import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-edit-employee',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-employee.component.html',
  styleUrl: './edit-employee.component.css'
})
export class EditEmployeeComponent implements OnInit {
  employeeId!: number;
  employee: any = {
    fullName: '',
    email: '',
    jobTitle: '',
    salary: 0,
    departmentId: 0
  };
  departments: any[] = [];

  constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.employeeId = +this.route.snapshot.paramMap.get('id')!;
    this.fetchDepartments();
    this.loadEmployee();
  }

  fetchDepartments() {
    this.http.get<any[]>(`${environment.apiUrl}/Department`).subscribe({
      next: (data) => (this.departments = data)
    });
  }

  loadEmployee() {
    this.http.get<any>(`${environment.apiUrl}/Employee/${this.employeeId}`).subscribe({
      next: (data) => (this.employee = data),
      error: () => alert('Error loading employee')
    });
  }

  updateEmployee() {
    this.http.put(`${environment.apiUrl}/Employee/${this.employeeId}`, this.employee).subscribe({
      next: () => this.router.navigate(['/employees']),
      error: () => alert('Failed to update employee')
    });
  }
}