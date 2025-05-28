// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-login',
//   standalone: true,
//   imports: [],
//   templateUrl: './login.component.html',
//   styleUrl: './login.component.css'
// })
// export class LoginComponent {

// }

import { Component, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
  // Add other response properties as needed
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule, ReactiveFormsModule
  ],
  templateUrl:'./login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private router = inject(Router);

  loginForm: FormGroup;
  isLoading = false;
  showPassword = false;
  errorMessage = '';

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const loginData: LoginRequest = {
        email: this.loginForm.value.email,
        password: this.loginForm.value.password
      };

      this.http.post<LoginResponse>('https://localhost:7215/api/Auth/login', loginData)
        .subscribe({
          next: (response) => {
            // Store the token
            localStorage.setItem('authToken', response.token);
            this.isLoading = false;
            // Navigate to dashboard or desired route
            this.router.navigate(['/dashboard']);
          },
          error: (error) => {
            this.errorMessage = 'Invalid credentials. Please try again.';
            this.isLoading = false;
            console.error('Login error:', error);
          }
        });
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.loginForm.controls).forEach(key => {
      const control = this.loginForm.get(key);
      control?.markAsTouched();
    });
  }

  getFieldError(fieldName: string): string {
    const field = this.loginForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) return `${fieldName} is required`;
      if (field.errors['email']) return 'Please enter a valid email';
      if (field.errors['minlength']) return `${fieldName} must be at least 6 characters`;
    }
    return '';
  }
}