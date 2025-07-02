import { Component, OnInit, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; 
interface Department {
  id: number;
  name: string;
  description: string;
}

@Component({
  selector: 'app-department',
  standalone: true,
  imports: [CommonModule, FormsModule,RouterModule],
  templateUrl: './departments.component.html',
  styleUrls: ['./departments.component.css'],
})
export class DepartmentComponent implements OnInit {
  http = inject(HttpClient);
  router = inject(Router);

  departments: Department[] = [];
  filteredDepartments: Department[] = [];
  searchTerm = '';

  ngOnInit() {
    this.loadDepartments();
  }
  goToDashboard() {
  this.router.navigate(['/dashboard']);
}


  loadDepartments() {
    this.http.get<Department[]>('https://localhost:7151/api/department').subscribe({
      next: (data) => {
        this.departments = data;
        this.filteredDepartments = data;
      },
      error: (err) => console.error('Error loading departments', err),
    });
  }

  searchDepartments() {
    if (!this.searchTerm.trim()) {
      this.filteredDepartments = this.departments;
      return;
    }
    const term = this.searchTerm.toLowerCase();
    this.filteredDepartments = this.departments.filter((d) =>
      d.name.toLowerCase().includes(term)
    );
  }

  goToEdit(id: number) {
    this.router.navigate(['/department/edit', id]);
  }

  goToDelete(id: number) {
    this.router.navigate(['/department/delete', id]);
  }

  goToCreate() {
    this.router.navigate(['/departments/create']);
  }
}
