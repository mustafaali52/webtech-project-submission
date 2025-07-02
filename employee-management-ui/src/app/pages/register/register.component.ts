import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service'; // correct path
import {  ViewEncapsulation } from '@angular/core';
import  { RouterModule } from '@angular/router';
interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  role: string;
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule,RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  encapsulation: ViewEncapsulation.None // 👈 Add this
})
export class RegisterComponent {
  user: RegisterRequest = {
    fullName: '',
    email: '',
    password: '',
    role: ''
  };

  constructor(private apiService: ApiService) {}

  register() {
    if (!this.user.role) {
      alert('Please select a role');
      return;
    }

    this.apiService.register(this.user).subscribe({
      next: (res) => {
        console.log('Registered successfully:', res);
        alert('Registration successful!');
      },
      error: (err) => {
        console.error('Registration failed:', err);
        alert('Registration failed, please try again.');
      }
    });
  }
}
