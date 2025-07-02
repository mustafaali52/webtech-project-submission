import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';

interface AuditLog {
  id: number;
  userId: number;
  action: string;
  timestamp: string;
}

@Component({
  selector: 'app-audit-log',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './audit-log.component.html',
  styleUrl: './audit-log.component.css'
})
export class AuditLogComponent implements OnInit {
  auditLogs: AuditLog[] = [];
  loading = true;
  error: string | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchAuditLogs();
  }

  fetchAuditLogs() {
    this.http.get<AuditLog[]>('https://localhost:7151/api/AuditLog/all').subscribe({
      next: (logs) => {
        this.auditLogs = logs;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load audit logs.';
        this.loading = false;
        console.error(err);
      }
    });
  }
}
