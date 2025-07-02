import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

export interface CartItem {
  cartItemId: number;
  cartId: number;
  bookId: number;
  bookTitle: string;
  bookAuthor: string;
  bookImageUrl?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  addedDate: string;
}

export interface Cart {
  cartId: number;
  userId: string;
  createdDate: string;
  lastModified: string;
  cartItems: CartItem[];
  totalAmount: number;
}

export interface AddToCartRequest {
  bookId: number;
  quantity: number;
}

export interface UpdateCartItemRequest {
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly API_URL = 'http://localhost:5001/api/cart';
  private cartSubject = new BehaviorSubject<Cart | null>(null);
  public cart$ = this.cartSubject.asObservable();

  constructor(private http: HttpClient) { }

  // Get current user's cart
  getMyCart(): Observable<Cart> {
    return this.http.get<Cart>(`${this.API_URL}/my-cart`)
      .pipe(
        tap(cart => this.cartSubject.next(cart))
      );
  }

  // Add item to cart
  addToCart(request: AddToCartRequest): Observable<Cart> {
    return this.http.post<Cart>(`${this.API_URL}/add`, request)
      .pipe(
        tap(cart => this.cartSubject.next(cart))
      );
  }

  // Update cart item quantity
  updateCartItem(cartItemId: number, request: UpdateCartItemRequest): Observable<Cart> {
    return this.http.put<Cart>(`${this.API_URL}/item/${cartItemId}`, request)
      .pipe(
        tap(cart => this.cartSubject.next(cart))
      );
  }

  // Remove item from cart
  removeFromCart(cartItemId: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/item/${cartItemId}`)
      .pipe(
        tap(() => {
          // Refresh cart after removal
          this.getMyCart().subscribe();
        })
      );
  }

  // Clear entire cart
  clearCart(): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/clear`)
      .pipe(
        tap(() => this.cartSubject.next(null))
      );
  }

  // Get current cart value
  getCurrentCart(): Cart | null {
    return this.cartSubject.value;
  }

  // Get cart item count
  getCartItemCount(): number {
    const cart = this.cartSubject.value;
    return cart ? cart.cartItems.reduce((total, item) => total + item.quantity, 0) : 0;
  }

  // Get cart total amount
  getCartTotal(): number {
    const cart = this.cartSubject.value;
    return cart ? cart.totalAmount : 0;
  }
}
