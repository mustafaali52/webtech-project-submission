import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-leave-request',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './leave-request.component.html',
  styleUrl: './leave-request.component.css'
})
export class LeaveRequestComponent implements OnInit {
  leaves: any[] = [];
  newLeave = {
    employeeId: null,
    startDate: '',
    endDate: '',
    reason: '',
    status: 'Pending'
  };

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getLeaves();
  }

  getLeaves(): void {
    this.http.get<any[]>(`${environment.apiUrl}/Leave`).subscribe({
      next: data => {
        this.leaves = data;
      },
      error: error => {
        console.error('Error fetching leaves:', error);
        alert('Failed to fetch leave requests');
      }
    });
  }

  submitLeave(): void {
    this.http.post(`${environment.apiUrl}/Leave`, this.newLeave).subscribe({
      next: () => {
        alert('Leave request submitted successfully');
        this.getLeaves();
        this.newLeave = {
          employeeId: null,
          startDate: '',
          endDate: '',
          reason: '',
          status: 'Pending'
        };
      },
      error: error => {
        console.error('Error submitting leave:', error);
        alert('Failed to submit leave request');
      }
    });
  }
}
