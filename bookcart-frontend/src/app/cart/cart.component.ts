import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject, takeUntil } from 'rxjs';
import { CartService, Cart, CartItem } from '../shared/services/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit, OnDestroy {
  cart: Cart | null = null;
  isLoading = true;
  isUpdating = false;
  
  private destroy$ = new Subject<void>();

  constructor(
    private cartService: CartService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadCart();
    
    // Subscribe to cart changes
    this.cartService.cart$
      .pipe(takeUntil(this.destroy$))
      .subscribe(cart => {
        this.cart = cart;
        this.isLoading = false;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadCart(): void {
    this.isLoading = true;
    this.cartService.getMyCart().subscribe({
      next: (cart) => {
        this.cart = cart;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading cart:', error);
        if (error.status === 404) {
          // Cart not found, user has empty cart
          this.cart = null;
        } else {
          this.snackBar.open('Error loading cart. Please try again.', 'Close', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
        }
        this.isLoading = false;
      }
    });
  }

  updateQuantity(item: CartItem, newQuantity: number): void {
    if (newQuantity < 1) {
      this.removeItem(item);
      return;
    }

    this.isUpdating = true;
    const request = { quantity: newQuantity };
    
    this.cartService.updateCartItem(item.cartItemId, request).subscribe({
      next: () => {
        this.isUpdating = false;
        this.snackBar.open('Cart updated successfully!', 'Close', {
          duration: 2000,
          panelClass: ['success-snackbar']
        });
      },
      error: (error) => {
        console.error('Error updating cart item:', error);
        this.isUpdating = false;
        this.snackBar.open('Error updating cart. Please try again.', 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  removeItem(item: CartItem): void {
    if (confirm(`Remove "${item.bookTitle}" from cart?`)) {
      this.isUpdating = true;
      
      this.cartService.removeFromCart(item.cartItemId).subscribe({
        next: () => {
          this.isUpdating = false;
          this.snackBar.open(`"${item.bookTitle}" removed from cart!`, 'Close', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
        },
        error: (error) => {
          console.error('Error removing cart item:', error);
          this.isUpdating = false;
          this.snackBar.open('Error removing item. Please try again.', 'Close', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
        }
      });
    }
  }

  clearCart(): void {
    if (confirm('Are you sure you want to clear your entire cart?')) {
      this.isUpdating = true;
      
      this.cartService.clearCart().subscribe({
        next: () => {
          this.isUpdating = false;
          this.cart = null;
          this.snackBar.open('Cart cleared successfully!', 'Close', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
        },
        error: (error) => {
          console.error('Error clearing cart:', error);
          this.isUpdating = false;
          this.snackBar.open('Error clearing cart. Please try again.', 'Close', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
        }
      });
    }
  }

  continueShopping(): void {
    this.router.navigate(['/books']);
  }

  proceedToCheckout(): void {
    // Navigate to checkout page (to be implemented)
    this.snackBar.open('Checkout functionality coming soon!', 'Close', {
      duration: 3000,
      panelClass: ['info-snackbar']
    });
  }

  getTotalItems(): number {
    return this.cart ? this.cart.cartItems.reduce((total, item) => total + item.quantity, 0) : 0;
  }

  getTotalAmount(): number {
    return this.cart ? this.cart.totalAmount : 0;
  }

  onImageError(event: any): void {
    event.target.src = 'assets/images/book-placeholder.jpg';
  }
}
