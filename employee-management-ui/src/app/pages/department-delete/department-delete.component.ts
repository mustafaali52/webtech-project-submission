import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-department-delete',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './department-delete.component.html',
  styleUrls: ['./department-delete.component.css'],
})
export class DepartmentDeleteComponent implements OnInit {
  private http = inject(HttpClient);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  id!: number;
  departmentName = '';
  loading = false;
  errorMsg = '';

  ngOnInit() {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.loadDepartment();
  }

loadDepartment() {
  this.http.get(`https://localhost:7151/api/department/${this.id}`).subscribe({
    next: (data: any) => (this.departmentName = data.name),
    error: () => (this.errorMsg = 'Failed to load department info'),
  });
}

  onDelete() {
    this.loading = true;
    this.http.delete(`https://localhost:7151/api/department/${this.id}`).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/departments']);
      },
      error: () => {
        this.loading = false;
        this.errorMsg = 'Delete failed. Please try again.';
      },
    });
  }

  onCancel() {
    this.router.navigate(['/departments']);
  }
}
