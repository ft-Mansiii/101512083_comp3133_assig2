import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { EmployeeService } from '../../core/services/employee';

@Component({
  selector: 'app-add-employee',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './add-employee.html',
  styleUrl: './add-employee.css'
})
export class AddEmployee {
  loading = false;
  errorMessage = '';
  successMessage = '';
  imagePreview: string | null = null;
  selectedImageBase64: string = '';

  employeeForm;

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private router: Router
  ) {
    this.employeeForm = this.fb.group({
      first_name: ['', [Validators.required, Validators.minLength(2)]],
      last_name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      gender: ['', Validators.required],
      designation: ['', Validators.required],
      salary: ['', [Validators.required, Validators.min(1)]],
      date_of_joining: ['', Validators.required],
      department: ['', Validators.required]
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) {
      return;
    }

    const file = input.files[0];

    // Optional validation
    if (!file.type.startsWith('image/')) {
      this.errorMessage = 'Please select a valid image file';
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const result = reader.result as string;
      this.selectedImageBase64 = result;
      this.imagePreview = result;
    };

    reader.onerror = () => {
      this.errorMessage = 'Failed to read image file';
    };

    reader.readAsDataURL(file);
  }

  onSubmit(): void {
    if (this.employeeForm.invalid) {
      this.employeeForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const formValue = {
      ...this.employeeForm.value,
      salary: Number(this.employeeForm.value.salary),
      employee_photo: this.selectedImageBase64 || ''
    };

    this.employeeService.addEmployee(formValue).subscribe({
      next: (result: any) => {
        this.loading = false;
        console.log('ADD EMPLOYEE RESULT:', result);

        const payload = result?.data?.addEmployee;

        if (payload?.success) {
          this.successMessage = payload.message || 'Employee added successfully';

          setTimeout(() => {
            this.router.navigate(['/employees']);
          }, 1200);
        } else {
          this.errorMessage = payload?.message || 'Failed to add employee';
        }
      },
      error: (err) => {
        this.loading = false;
        console.log('ADD EMPLOYEE ERROR:', err);

        if (err?.graphQLErrors?.length) {
          this.errorMessage = err.graphQLErrors[0].message;
        } else if (err?.networkError?.result?.errors?.length) {
          this.errorMessage = err.networkError.result.errors[0].message;
        } else if (err?.error?.errors?.length) {
          this.errorMessage = err.error.errors[0].message;
        } else {
          this.errorMessage = err.message || 'Failed to add employee';
        }
      }
    });
  }
}