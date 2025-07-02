import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common'; // ✅ Add this
import { NgIf, NgFor } from '@angular/common'; // ✅ Add if needed for explicit control flow
import { RouterModule } from '@angular/router';

interface LeaveDTO {
  id: number;
  employeeId: number;
  startDate: string;
  endDate: string;
  reason: string;
  status: string;
}


@Component({
  selector: 'app-leaves',
  standalone: true, // ✅ Ensure this is set
  imports: [CommonModule, RouterModule], // ✅ Add CommonModule here
  templateUrl: './leaves.component.html',
  styleUrls: ['./leaves.component.css']
})
export class LeavesComponent implements OnInit {
  leaves: LeaveDTO[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchLeaves();
  }

  fetchLeaves() {
    this.http.get<LeaveDTO[]>('https://localhost:7151/api/Leave') // adjust URL if needed
      .subscribe({
        next: (data) => this.leaves = data,
        error: (err) => console.error('Failed to load leaves', err)
      });
  }

  approveLeave(id: number) {
    this.updateStatus(id, 'Approved');
  }

  rejectLeave(id: number) {
    this.updateStatus(id, 'Rejected');
  }

 updateStatus(id: number, status: string) {
  const leave = this.leaves.find(l => l.id === id);
  if (!leave) {
    console.error(`Leave with ID ${id} not found`);
    return;
  }

  // Create updated object with all required fields
  const updatedLeave = {
    ...leave,
    status: status
  };

  this.http.put(`https://localhost:7151/api/Leave/${id}`, updatedLeave)
    .subscribe({
      next: () => {
        console.log(`Leave ${id} updated`);
        this.fetchLeaves();
      },
      error: (err) => console.error(`Failed to update status to ${status}`, err)
    });
}

}
