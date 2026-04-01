import { Component } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './signup.html',
  styleUrl: './signup.css'
})
export class Signup {
  errorMessage = '';
  successMessage = '';
  loading = false;
  signupForm;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.signupForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    });
  }

  onSubmit() {
    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      return;
    }

    const { username, email, password, confirmPassword } = this.signupForm.value;

    if (password !== confirmPassword) {
      this.errorMessage = 'Passwords do not match';
      this.successMessage = '';
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.authService.signup(username!, email!, password!).subscribe({
      next: (res) => {
        this.loading = false;

        if (res.success) {
          this.successMessage = res.message || 'Signup successful!';
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 1200);
        } else {
          this.errorMessage = res.message || 'Signup failed';
        }
      },
      error: (err) => {
        this.loading = false;
        console.log('SIGNUP ERROR FULL:', err);

        if (err?.graphQLErrors?.length) {
          this.errorMessage = err.graphQLErrors[0].message;
        } else if (err?.networkError?.result?.errors?.length) {
          this.errorMessage = err.networkError.result.errors[0].message;
        } else {
          this.errorMessage = err.message || 'Signup failed';
        }
      }
    });
  }
}