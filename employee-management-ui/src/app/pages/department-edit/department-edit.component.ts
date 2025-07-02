import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-department-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './department-edit.component.html',
  styleUrls: ['./department-edit.component.css'],
})
export class DepartmentEditComponent implements OnInit {
  private http = inject(HttpClient);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  departmentForm!: FormGroup;
  id!: number;
  loading = false;
  errorMsg = '';

  ngOnInit() {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.departmentForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
    });

    this.loadDepartment();
  }

loadDepartment() {
  this.http.get<any[]>(`${environment.apiUrl}/department`).subscribe({
    next: (departments) => {
      const dept = departments.find(d => d.id === this.id);
      if (dept) {
        this.departmentForm.patchValue({
          name: dept.name,
          description: dept.description
        });
      } else {
        this.errorMsg = 'Department not found.';
      }
    },
    error: () => {
      this.errorMsg = 'Failed to load departments.';
    }
  });
}

  onSubmit() {
    if (this.departmentForm.invalid) return;

    this.loading = true;
    this.http.put(`${environment.apiUrl}/department/${this.id}`, this.departmentForm.value).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/departments']);
      },
      error: () => {
        this.loading = false;
        this.errorMsg = 'Update failed. Please try again.';
      },
    });
  }

  onCancel() {
    this.router.navigate(['/departments']);
  }
}
