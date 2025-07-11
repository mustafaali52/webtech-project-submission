import { Component, OnInit } from '@angular/core';
import { StudentQuizService } from '../attempt.service';
import { AttemptHistoryDto } from '../../shared/models/student-quiz';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-student-quiz',
  templateUrl: './getmarks.component.html',
  styleUrls: ['./getmarks.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatTableModule
  ]
})
export class GetmarksComponent implements OnInit {
  attempts: AttemptHistoryDto[] = [];
  loading = false;
  errorMessage = '';

  constructor(private studentQuizService: StudentQuizService) {}

  ngOnInit(): void {
    this.loadAttempts();
  }

  loadAttempts(): void {
    this.loading = true;
    this.errorMessage = '';
    this.studentQuizService.getMyAttempts().subscribe({
      next: (data) => {
        this.attempts = data;
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = error.message || 'Failed to load attempts.';
        this.loading = false;
      }
    });
  }
}