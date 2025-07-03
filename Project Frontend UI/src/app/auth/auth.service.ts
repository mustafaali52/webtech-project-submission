import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError, throwError, tap } from 'rxjs';
import { environment } from '../../environment/environment';
import { TokenService } from '../shared/services/token.service';


export interface RegisterDto {
  userName: string;
  email: string;
  password: string;      
  roleId: number;        // e.g. 1 = Admin, 2 = Attendee, 3 = Organizer
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;   // -> https://localhost:7142/api

  constructor(
    private http: HttpClient,
    private tokenService: TokenService
  ) {}


  registerUser(dto: RegisterDto): Observable<string> {
    return this.http.post(
      `${this.apiUrl}/auth/register`,
      {
        userName:    dto.userName,
        email:       dto.email,
        passwordHash: dto.password,  
        userRoleId:  dto.roleId
      },
      { responseType: 'text' }    
    ).pipe(
      map(res => res),
      catchError(err => {
        console.error('Registration error', err);
        return throwError(
          () => new Error('Registration failed. Please try again later.')
        );
      })
    );
  }


  login(userName: string, password: string): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(
      `${this.apiUrl}/auth/login`,
      {
        userName,
        passwordHash: password
      }
    ).pipe(
      tap(res => {
        if (res?.token) {
          this.tokenService.setToken(res.token);
        }
      })
    );
  }

  logout(): void {
    this.tokenService.removeToken();
  }
}
