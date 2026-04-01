import { Component } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  errorMessage = '';
  loading = false;
  loginForm;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      usernameOrEmail: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const { usernameOrEmail, password } = this.loginForm.value;

    this.loading = true;
    this.errorMessage = '';

    this.authService.login(usernameOrEmail!, password!).subscribe({
      next: (res) => {
        this.loading = false;

        if (res.success) {
          this.router.navigate(['/employees']);
        } else {
          this.errorMessage = res.message || 'Login failed';
        }
      },
      error: (err) => {
        this.loading = false;
        console.log('LOGIN ERROR FULL:', err);

        if (err?.graphQLErrors?.length) {
          this.errorMessage = err.graphQLErrors[0].message;
        } else if (err?.networkError?.result?.errors?.length) {
          this.errorMessage = err.networkError.result.errors[0].message;
        } else {
          this.errorMessage = err.message || 'Login failed';
        }
      }
    });
  }
}