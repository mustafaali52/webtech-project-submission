import { Component } from '@angular/core';

@Component({
  selector: 'app-order-list',
  template: `
    <div class="order-list-container">
      <div class="header">
        <h1>
          <mat-icon>receipt_long</mat-icon>
          My Orders
        </h1>
        <p>View your order history</p>
      </div>

      <mat-card class="coming-soon-card">
        <mat-card-content>
          <div class="coming-soon-content">
            <mat-icon class="coming-soon-icon">construction</mat-icon>
            <h2>Coming Soon!</h2>
            <p>Order management functionality is under development.</p>
            <p>You'll be able to view and track your orders here soon.</p>
            
            <button mat-raised-button color="primary" routerLink="/books">
              <mat-icon>library_books</mat-icon>
              Continue Shopping
            </button>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .order-list-container {
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      margin-bottom: 30px;
    }
    .header h1 {
      display: flex;
      align-items: center;
      gap: 12px;
      margin: 0 0 8px 0;
      color: #333;
    }
    .header p {
      margin: 0;
      color: #666;
    }
    .coming-soon-card {
      padding: 20px;
    }
    .coming-soon-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      padding: 40px 20px;
    }
    .coming-soon-icon {
      font-size: 80px;
      height: 80px;
      width: 80px;
      color: #ff9800;
      margin-bottom: 20px;
    }
    h2 {
      margin: 0 0 16px 0;
      color: #333;
    }
    p {
      margin: 0 0 12px 0;
      color: #666;
    }
    button {
      margin-top: 24px;
    }
  `]
})
export class OrderListComponent {}
