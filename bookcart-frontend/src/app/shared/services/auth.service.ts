import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, catchError, throwError } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phoneNumber?: string;
  address?: string;
}

export interface AuthResponse {
  token: string;
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
  expiration: string;
}

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  address?: string;
  createdDate: string;
  isActive: boolean;
  roles: string[];
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = 'http://localhost:5003/api/auth';
  private currentUserSubject = new BehaviorSubject<UserProfile | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private jwtHelper: JwtHelperService,
    private router: Router
  ) {
    this.loadCurrentUser();
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    console.log('Attempting login with:', credentials.email);
    return this.http.post<AuthResponse>(`${this.API_URL}/login`, credentials)
      .pipe(
        tap(response => {
          console.log('Login successful:', response);
          this.setSession(response);
        }),
        catchError(this.handleError.bind(this))
      );
  }

  register(userData: RegisterRequest): Observable<AuthResponse> {
    console.log('Attempting registration with:', { ...userData, password: '[HIDDEN]' });
    return this.http.post<AuthResponse>(`${this.API_URL}/register`, userData)
      .pipe(
        tap(response => {
          console.log('Registration successful:', response);
          this.setSession(response);
        }),
        catchError(this.handleError.bind(this))
      );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  getProfile(): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.API_URL}/profile`)
      .pipe(
        tap(profile => {
          this.currentUserSubject.next(profile);
          localStorage.setItem('user', JSON.stringify(profile));
        }),
        catchError(this.handleError.bind(this))
      );
  }

  updateProfile(profile: Partial<UserProfile>): Observable<UserProfile> {
    return this.http.put<UserProfile>(`${this.API_URL}/profile`, profile)
      .pipe(
        tap(updatedProfile => {
          this.currentUserSubject.next(updatedProfile);
          localStorage.setItem('user', JSON.stringify(updatedProfile));
        }),
        catchError(this.handleError.bind(this))
      );
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return token ? !this.jwtHelper.isTokenExpired(token) : false;
  }

  hasRole(role: string): boolean {
    const user = this.currentUserSubject.value;
    return user ? user.roles.includes(role) : false;
  }

  isAdmin(): boolean {
    return this.hasRole('Admin');
  }

  getCurrentUser(): UserProfile | null {
    return this.currentUserSubject.value;
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  private setSession(authResponse: AuthResponse): void {
    localStorage.setItem('token', authResponse.token);
    
    const userProfile: UserProfile = {
      id: authResponse.userId,
      firstName: authResponse.firstName,
      lastName: authResponse.lastName,
      email: authResponse.email,
      phoneNumber: '',
      address: '',
      createdDate: new Date().toISOString(),
      isActive: true,
      roles: authResponse.roles
    };
    
    localStorage.setItem('user', JSON.stringify(userProfile));
    this.currentUserSubject.next(userProfile);
  }

  private loadCurrentUser(): void {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    
    if (token && !this.jwtHelper.isTokenExpired(token) && userStr) {
      const user = JSON.parse(userStr);
      this.currentUserSubject.next(user);
    } else {
      this.logout();
    }
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('Auth service error:', error);
    
    let errorMessage = 'An error occurred';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Client Error: ${error.error.message}`;
    } else {
      // Server-side error
      if (error.status === 0) {
        errorMessage = 'Unable to connect to server. Please check your internet connection.';
      } else if (error.status === 400) {
        if (error.error?.errors) {
          const errors = Object.values(error.error.errors).flat();
          errorMessage = errors.join(', ');
        } else if (error.error?.message) {
          errorMessage = error.error.message;
        } else {
          errorMessage = 'Invalid request data';
        }
      } else if (error.status === 401) {
        errorMessage = 'Invalid credentials';
      } else if (error.status === 403) {
        errorMessage = 'Access denied';
      } else if (error.status === 404) {
        errorMessage = 'Service not found';
      } else if (error.status >= 500) {
        errorMessage = 'Server error. Please try again later.';
      } else {
        errorMessage = error.error?.message || `Server error: ${error.status}`;
      }
    }
    
    return throwError(() => ({ message: errorMessage, status: error.status }));
  }
}
