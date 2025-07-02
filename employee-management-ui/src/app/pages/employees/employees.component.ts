import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router'; // ✅ Import this too
import { FormsModule } from '@angular/forms'; // ✅ Import this
@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule ], 
 
  
  templateUrl: './employees.component.html',
  styleUrl: './employees.component.css'
})
export class EmployeesComponent implements OnInit {
  employees: any[] = [];
  errorMessage: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.loadEmployees();
  }
searchTerm: string = '';

get filteredEmployees() {
  return this.employees.filter(emp =>
    emp.fullName.toLowerCase().includes(this.searchTerm.toLowerCase())
  );
}

deleteEmployee(id: number) {
  if (confirm('Are you sure you want to delete this employee?')) {
    this.http.delete(`${environment.apiUrl}/Employee/${id}`).subscribe({
      next: () => {
        this.employees = this.employees.filter(e => e.id !== id);
      },
      error: () => alert('Failed to delete employee')
    });
  }
}

  loadEmployees() {
    this.http.get<any[]>(`${environment.apiUrl}/Employee`)
      .subscribe({
        next: (data) => {
          this.employees = data;
        },
        error: (err) => {
          this.errorMessage = 'Failed to load employees.';
          if (err.status === 401) {
            this.router.navigate(['/login']);
          }
        }
      });
  }
}
