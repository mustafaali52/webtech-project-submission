import {
  Component,
  AfterViewInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements AfterViewInit {
  userName: string = '';
  role: string = '';
  searchTerm: string = '';

  // Stats
  employeeStats = { total: 0, active: 0, inactive: 0 };
  leaveStats = { pending: 0, approved: 0, rejected: 0 };
  logStats = { today: 0, successful: 0, failed: 0 };
systemLogs = {
  loginsToday: 0,
  successful: 0,
  failed: 0
};

  // Navigation Links and Buttons
  allNavLinks = [
    { label: 'Dashboard', route: '/dashboard', icon: 'fa-solid fa-gauge', roles: ['Admin', 'Manager', 'Employee'] },
    { label: 'Employees', route: '/employees', icon: 'fa-solid fa-users', roles: ['Admin', 'Manager'] },
    { label: 'Departments', route: '/departments', icon: 'fa-solid fa-building', roles: ['Admin'] },
    { label: 'Leave Requests', route: '/leaves', icon: 'fa-solid fa-plane', roles: ['Admin', 'Manager'] },
    { label: 'Performance', route: '/performance', icon: 'fa-solid fa-chart-line', roles: ['Admin', 'Manager'] },
    { label: 'Audit Logs', route: '/audit-logs', icon: 'fa-solid fa-file-lines', roles: ['Admin'] },
  ];

 allQuickButtons: { [key: string]: { label: string; route: string; icon?: string; color: string }[] } = {
  Admin: [
    { label: 'Manage Employees', route: '/employees', icon: 'fa-solid fa-users', color: 'blue' },
    { label: 'Manage Departments', route: '/departments', icon: 'fa-solid fa-building', color: 'green' },
    { label: 'Manage Leaves', route: '/leaves', icon: 'fa-solid fa-plane', color: 'cyan' },
    { label: 'Performance Reviews', route: '/performance', icon: 'fa-solid fa-chart-line', color: 'yellow' },
    { label: 'Audit Logs', route: '/audit-logs', icon: 'fa-solid fa-file-lines', color: 'gray' },
  ],
  Manager: [
    { label: 'Manage Employees', route: '/employees', color: 'blue' },
    { label: 'View Departments', route: '/departments/list', color: 'green' },
    { label: 'Approve/Reject Leaves', route: '/leaves', color: 'cyan' },
    { label: 'Submit Reviews', route: '/performance', color: 'yellow' },
  ],
  Employee: [
    { label: 'Upload Files', route: '/upload-file', color: 'blue' },
    { label: 'View Reviews', route: '/reviews', color: 'cyan' },
    { label: 'Request Leave', route: '/leave-request', color: 'yellow' },
  ],
};

  get filteredNavLinks() {
    return this.allNavLinks.filter(link => link.roles.includes(this.role));
  }

  get filteredQuickButtons() {
  const buttons = this.allQuickButtons[this.role] || [];
  return buttons.filter((btn: { label: string }) =>
    btn.label.toLowerCase().includes(this.searchTerm.toLowerCase())
  );
}

  constructor(private router: Router, private http: HttpClient) {
    this.decodeToken();
    this.fetchStats();
  }

  decodeToken() {
    if (typeof window === 'undefined') return;

    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/login']);
      return;
    }

    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const decodedPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => `%${('00' + c.charCodeAt(0).toString(16)).slice(-2)}`)
          .join('')
      );
      const payload = JSON.parse(decodedPayload);
      this.userName =
        payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] || 'User';
      this.role =
        payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || 'Employee';
    } catch (error) {
      localStorage.removeItem('token');
      this.router.navigate(['/login']);
    }
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
fetchStats() {
  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  // Only allow Admin and Manager to fetch full stats
  if (this.role === 'Admin' || this.role === 'Manager') {
    this.http.get<any>('https://localhost:7151/api/Dashboard/stats', { headers }).subscribe({
      next: data => {
        this.employeeStats = {
          total: data.totalEmployees,
          active: data.activeEmployees,
          inactive: data.inactiveEmployees
        };
        this.leaveStats = {
          pending: data.leavesPending,
          approved: data.leavesApproved,
          rejected: data.leavesRejected
        };
        this.systemLogs = {
          loginsToday: data.loginsToday,
          successful: data.successfulLogins,
          failed: data.failedLogins
        };
      },
      error: err => {
        console.error('Failed to fetch stats:', err);
      }
    });
  }

  // All roles can access the performance chart
  this.http.get<any>('https://localhost:7151/api/Dashboard/performance-chart', { headers }).subscribe({
    next: data => {
      this.renderChart(data);
    },
    error: err => {
      console.error('Failed to fetch performance chart:', err);
    }
  });
}


  ngAfterViewInit(): void {
    // Placeholder, actual rendering is triggered in fetchStats when data arrives
  }

  renderChart(data: any) {
  const labels = data.map((item: any) => item.name);
  const values = data.map((item: any) => item.avgScore);

  const ctx = document.getElementById('performanceChart') as HTMLCanvasElement;
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Performance Score',
          data: values,
          borderColor: 'rgba(54, 162, 235, 1)',
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderWidth: 2
        }
      ]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          max: 5
        }
      }
    }
  });
}

}
