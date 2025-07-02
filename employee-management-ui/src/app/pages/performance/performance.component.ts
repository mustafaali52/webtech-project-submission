import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule, DatePipe } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-performance',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  providers: [DatePipe],
  templateUrl: './performance.component.html',
  styleUrls: ['./performance.component.css']
})

export class PerformanceComponent implements OnInit {
  reviews: any[] = [];
  reviewForm!: FormGroup;
  baseUrl = 'https://localhost:7151/api/PerformanceReview';
  editingReviewId: number | null = null;

  constructor(private http: HttpClient, private fb: FormBuilder, private router: Router) {}


  ngOnInit(): void {
    this.initForm();
    this.getReviews();
  }

  initForm() {
    this.reviewForm = this.fb.group({
      employeeId: ['', Validators.required],
      reviewer: ['', Validators.required],
      comments: ['', Validators.required],
      reviewDate: ['', Validators.required],
      rating: [null, [Validators.required, Validators.min(1), Validators.max(5)]],
      score: ['', Validators.required]
    });
  }

  getReviews() {
    this.http.get<any[]>(this.baseUrl).subscribe(data => {
      this.reviews = data;
    });
  }

  submitReview() {
    if (this.reviewForm.valid) {
      const formData = {
        ...this.reviewForm.value,
        employeeId: Number(this.reviewForm.value.employeeId),
        rating: Number(this.reviewForm.value.rating),
        score: Number(this.reviewForm.value.score)
      };

      if (this.editingReviewId) {
        // Update existing review
        this.http.put(`${this.baseUrl}/${this.editingReviewId}`, formData).subscribe({
          next: () => {
            this.reviewForm.reset();
            this.editingReviewId = null;
            this.getReviews();
          },
          error: err => {
            console.error("Update failed:", err);
            alert("Error updating review");
          }
        });
      } else {
        // Create new review
        this.http.post(this.baseUrl, formData).subscribe({
          next: () => {
            this.reviewForm.reset();
            this.getReviews();
          },
          error: err => {
            console.error("Review submission failed:", err);
            alert("Error: " + (err?.error?.message || "Review submission failed"));
          }
        });
      }
    }
  }

  editReview(review: any) {
    this.editingReviewId = review.id;

    this.reviewForm.patchValue({
      employeeId: review.employeeId,
      reviewer: review.reviewer,
      comments: review.comments,
      reviewDate: review.reviewDate ? new Date(review.reviewDate).toISOString().substring(0, 10) : '',
      rating: review.rating,
      score: review.score
    });
  }

  cancelEdit() {
    this.editingReviewId = null;
    this.reviewForm.reset();
  }

  deleteReview(id: number) {
    if (confirm('Are you sure you want to delete this review?')) {
      this.http.delete(`${this.baseUrl}/${id}`).subscribe({
        next: () => {
          this.getReviews();
        },
        error: err => {
          console.error("Delete failed:", err);
          alert("Error deleting review");
        }
      });
    }
    
  }
  navigateToDashboard() {
  this.router.navigate(['/dashboard']); // Adjust the route path as needed
}

}
