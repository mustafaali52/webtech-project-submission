import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-unauthorized',
  template: `
    <div class="unauthorized-container">
      <mat-card class="unauthorized-card">
        <mat-card-content>
          <div class="unauthorized-content">
            <mat-icon class="unauthorized-icon">block</mat-icon>
            <h1>Access Denied</h1>
            <p>You don't have permission to access this page.</p>
            <p>Please contact an administrator if you believe this is an error.</p>
            
            <div class="actions">
              <button mat-raised-button color="primary" (click)="goHome()">
                <mat-icon>home</mat-icon>
                Go to Home
              </button>
              <button mat-button (click)="goBack()">
                <mat-icon>arrow_back</mat-icon>
                Go Back
              </button>
            </div>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .unauthorized-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: calc(100vh - 64px);
      padding: 20px;
    }
    .unauthorized-card {
      max-width: 500px;
      width: 100%;
    }
    .unauthorized-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      padding: 40px 20px;
    }
    .unauthorized-icon {
      font-size: 80px;
      height: 80px;
      width: 80px;
      color: #f44336;
      margin-bottom: 20px;
    }
    h1 {
      margin: 0 0 16px 0;
      color: #333;
    }
    p {
      margin: 0 0 12px 0;
      color: #666;
    }
    .actions {
      display: flex;
      gap: 12px;
      margin-top: 24px;
    }
  `]
})
export class UnauthorizedComponent {
  constructor(private router: Router) {}

  goHome(): void {
    this.router.navigate(['/books']);
  }

  goBack(): void {
    window.history.back();
  }
}
