import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    RouterLink

  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  errorMessage = '';
  loginForm: ReturnType<FormBuilder['group']>;

  constructor(private fb: FormBuilder, 
    private authService: AuthService
    , private router: Router) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
  if (this.loginForm.invalid) {
    this.errorMessage = 'Please fill in all fields';
    return;
  }

  const { username, password } = this.loginForm.value;

  this.authService.login(username, password).subscribe({
    next: () => {
      this.router.navigate(['/products']);
    },
    error: (error) => {
      console.log('Login failed', error);
      this.errorMessage = 'Invalid username or password';
    }
  });
}

}
