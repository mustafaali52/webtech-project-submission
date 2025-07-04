import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { TokenService } from '../shared/services/token.service';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5230/api/Auth';

  constructor(private http: HttpClient, private tokenService: TokenService) {}

  private capitalizeRole(role: string): string {
    return role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
  }

  login(payload: LoginRequest): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, payload).pipe(
      tap(response => {
        this.tokenService.setToken(response.token);
        localStorage.setItem('role', this.capitalizeRole(response.role));
        localStorage.setItem('username', response.username);
      })
    );
  }

  register(payload: RegisterRequest): Observable<any> {
    const updatedPayload = {
      ...payload,
      role: this.capitalizeRole(payload.role)
    };
    return this.http.post(`${this.apiUrl}/register`, updatedPayload);
  }

  getToken(): string | null {
    return this.tokenService.getToken();
  }

  getRole(): string | null {
    return localStorage.getItem('role');
  }

  getUsername(): string | null {
    return localStorage.getItem('username');
  }

  isLoggedIn(): boolean {
    return this.tokenService.isLoggedIn();
  }

  logout(): void {
    this.tokenService.clear();
  }
}
