import { Component } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html'
})
export class RegisterComponent {
  username = '';
  email = '';
  password = '';
  role = ''; // default value, or make it a dropdown

  constructor(private authService: AuthService) {}

  onRegister() {
    const payload = {
      username: this.username,
      email: this.email,
      password: this.password,
      role: this.role
    };

    this.authService.register(payload).subscribe({
      next: res => {
        console.log('Registration success:', res);
        alert('Registered successfully!');
      },
      error: err => {
        console.error('Registration failed:', err);
        alert('Registration failed');
      }
    });
  }
}
