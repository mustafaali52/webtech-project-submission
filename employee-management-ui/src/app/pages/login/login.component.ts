import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule,RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email = '';
  password = '';
  role = '';
  errorMessage = '';

  constructor(private http: HttpClient, private router: Router) {}

  login() {
    if (!this.email || !this.password || !this.role) {
      this.errorMessage = 'All fields are required.';
      return;
    }

    const payload = {
      email: this.email,
      password: this.password,
      role: this.role
    };

    this.http.post<any>('https://localhost:7151/api/Auth/login', payload).subscribe({
      next: (res) => {
        localStorage.setItem('token', res.token);
        this.router.navigate(['/dashboard']);
      },
      error: () => {
        this.errorMessage = 'Invalid credentials or role. Please try again.';
      }
    });
  }
}
