import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { TokenService } from 'src/app/shared/services/token.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent {
  username = '';
  password = '';
  errorMessage: string = ''; // ✅ Fix for .errorMessage

  constructor(
    private authService: AuthService,
    private tokenService: TokenService,
    private router: Router // ✅ Fix for .router
  ) {}

  onLogin() {
    const payload = {
      username: this.username,
      password: this.password
    };

    this.authService.login(payload).subscribe({
      next: (res) => {
        console.log('✅ Login Success:', res);

        // Save token and user data
        localStorage.setItem('token', res.token);
        localStorage.setItem('username', res.username);
        localStorage.setItem('role', res.role);

        // Redirect to dashboard
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        console.error('❌ Login error:', err);
        this.errorMessage = err.error.message || 'Login failed!';
      }
    });
  }
}
