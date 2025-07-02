import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { RouterModule, Router } from '@angular/router';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-department-create',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './department-create.component.html',
  styleUrl: './department-create.component.css'
})
export class DepartmentCreateComponent {
  department = {
    name: '',
    description: ''
  };

  constructor(private http: HttpClient, private router: Router) {}

  createDepartment() {
    this.http.post(`${environment.apiUrl}/Department`, this.department).subscribe({
      next: () => {
        alert('Department created successfully!');
        this.router.navigate(['/departments']);
      },
      error: () => {
        alert('Failed to create department');
      }
    });
  }
}
