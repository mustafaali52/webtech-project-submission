import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    RouterLink
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: ReturnType<FormBuilder['group']>;
  roles = ['Admin', 'Attendee', 'Organizer'];  // Match backend roles
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['Attendee', Validators.required]
    });
  }

  // register.component.ts  (excerpt)

onSubmit(): void {
  if (this.registerForm.invalid) {
    this.errorMessage = 'Please fill in all required fields correctly.';
    return;
  }

  const { username, email, password, role } = this.registerForm.value;

  const dto = {
    userName: username,
    email,
    password,                 // <-- matches RegisterDto
    roleId: this.mapRoleToId(role)
  } as const;                 // helps TS infer literal types

  this.authService.registerUser(dto).subscribe({
    next: () => this.router.navigate(['/login']),
    error: err => {
      this.errorMessage =
        err?.message ?? 'Registration failed. Please try again later.';
    }
  });
}


  private mapRoleToId(role: string): number {
    switch (role) {
      case 'Admin': return 1;
      case 'Attendee': return 2;
      case 'Organizer': return 3;
      default: return 0; // or throw error
    }
  }
}
