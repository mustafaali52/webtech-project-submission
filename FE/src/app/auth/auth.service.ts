import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { environment } from '../../environment/environment';

// Assuming you have a TokenService to manage JWT tokens
import { TokenService } from '../shared/services/token.service';

// Define User interface matching your schema
export interface User {
  username: string;
  password: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl; // e.g. 'http://localhost:5000/api'

  constructor(private http: HttpClient, private tokenService: TokenService) { }

  // Signup method accepting username, password, role
  signup(username: string, password: string, role: string): Observable<string> {
    return this.http.post(`${this.apiUrl}/auth/register`, {
      username,
      password,
      role
    }, { responseType: 'text' })
      .pipe(
        map(response => response),
        catchError(error => {
          console.error('Signup error:', error);
          return throwError(() => new Error('Signup failed. Please try again later.'));
        })
      );
  }

  // Login method accepting username, password, and role
  login(username: string, password: string, role: string): Observable<any> {
    return this.http.post<{ token: string }>(`${this.apiUrl}/auth/login`, { username, password, role })
      .pipe(
        tap(response => {
          if (response && response.token) {
            this.tokenService.setToken(response.token);
          }
        }),
        catchError(error => {
          console.error('Login error:', error);
          return throwError(() => new Error('Login failed. Please check your credentials.'));
        })
      );
  }

  logout(): void {
    this.tokenService.removeToken();
  }
}