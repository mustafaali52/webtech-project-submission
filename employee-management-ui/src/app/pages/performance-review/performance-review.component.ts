import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

interface PerformanceReviewDTO {
  id: number;
  employeeId: number;
  reviewer: string;
  comments: string;
  reviewDate: string;
  rating: number;
}

@Component({
  selector: 'app-performance-review',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './performance-review.component.html',
  styleUrls: ['./performance-review.component.css']
})
export class PerformanceReviewComponent implements OnInit {
  reviews: PerformanceReviewDTO[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadReviews();
  }

  loadReviews() {
    this.http.get<PerformanceReviewDTO[]>('https://localhost:7151/api/PerformanceReview')
      .subscribe({
        next: (data) => this.reviews = data,
        error: (err) => console.error('Failed to load performance reviews', err)
      });
  }
}
