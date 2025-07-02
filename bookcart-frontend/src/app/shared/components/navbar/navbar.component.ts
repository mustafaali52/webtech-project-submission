import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AuthService, UserProfile } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {
  currentUser: UserProfile | null = null;
  cartItemCount = 0;
  searchTerm = '';
  private destroy$ = new Subject<void>();

  constructor(
    private authService: AuthService,
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Subscribe to current user
    this.authService.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        this.currentUser = user;
        if (user) {
          // Load cart when user logs in
          this.cartService.getMyCart().subscribe();
        }
      });

    // Subscribe to cart changes
    this.cartService.cart$
      .pipe(takeUntil(this.destroy$))
      .subscribe(cart => {
        this.cartItemCount = cart ? cart.cartItems.reduce((total, item) => total + item.quantity, 0) : 0;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  onSearch(): void {
    if (this.searchTerm.trim()) {
      this.router.navigate(['/books'], { queryParams: { search: this.searchTerm.trim() } });
    } else {
      this.router.navigate(['/books']);
    }
  }

  logout(): void {
    this.authService.logout();
  }

  goToCart(): void {
    this.router.navigate(['/cart']);
  }

  goToProfile(): void {
    // Navigate to profile page (to be implemented)
    console.log('Navigate to profile');
  }

  goToOrders(): void {
    this.router.navigate(['/orders']);
  }

  goToAdminPanel(): void {
    this.router.navigate(['/admin/users']);
  }
}
