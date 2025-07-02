import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms'; // ✅ Add this

@Component({
  selector: 'app-department-list',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './department-list.component.html',
  styleUrl: './department-list.component.css'
})
export class DepartmentListComponent implements OnInit {
  departments: any[] = [];
  searchTerm: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.loadDepartments();
  }

  get filteredDepartments() {
    return this.departments.filter(d =>
      d.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      d.description.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }

  loadDepartments(): void {
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders();

    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    this.http.get<any[]>(`${environment.apiUrl}/Department`, { headers }).subscribe({
      next: data => {
        this.departments = data;
        console.log("Departments loaded:", data);
      },
      error: error => {
        console.error('Error loading departments:', error);
        alert('Failed to load departments');
      }
    });
  }
}
