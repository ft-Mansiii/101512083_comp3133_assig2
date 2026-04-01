import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { EmployeeService } from '../../core/services/employee';

@Component({
  selector: 'app-update-employee',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './update-employee.html',
  styleUrl: './update-employee.css'
})
export class UpdateEmployee implements OnInit {
  loading = true;
  submitting = false;
  errorMessage = '';
  successMessage = '';
  imagePreview: string | null = null;
  selectedImageBase64: string = '';
  employeeId = '';

  employeeForm;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private employeeService: EmployeeService
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

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id || id === 'undefined') {
      this.loading = false;
      this.errorMessage = 'Employee ID not found';
      return;
    }

    this.employeeId = id;

    this.employeeService.getEmployeeById(id).subscribe({
      next: (result: any) => {
        this.loading = false;
        console.log('UPDATE EMPLOYEE FETCH RESULT:', result);

        const payload = result?.data?.searchEmployeeByEid;

        if (payload?.success && payload.employee) {
          const emp = payload.employee;

          this.employeeForm.patchValue({
            first_name: emp.first_name,
            last_name: emp.last_name,
            email: emp.email,
            gender: emp.gender,
            designation: emp.designation,
            salary: emp.salary,
            date_of_joining: emp.date_of_joining
              ? new Date(Number(emp.date_of_joining)).toISOString().split('T')[0]
              : '',
            department: emp.department
          });

          this.imagePreview = emp.employee_photo || null;
        } else {
          this.errorMessage = payload?.message || 'Failed to load employee';
        }
      },
      error: (err) => {
        this.loading = false;
        console.log('UPDATE EMPLOYEE FETCH ERROR:', err);

        if (err?.graphQLErrors?.length) {
          this.errorMessage = err.graphQLErrors[0].message;
        } else if (err?.networkError?.result?.errors?.length) {
          this.errorMessage = err.networkError.result.errors[0].message;
        } else {
          this.errorMessage = err.message || 'Failed to load employee';
        }
      }
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) {
      return;
    }

    const file = input.files[0];

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

    this.submitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    const input: any = {
      ...this.employeeForm.value,
      salary: Number(this.employeeForm.value.salary)
    };

    if (this.selectedImageBase64) {
      input.employee_photo = this.selectedImageBase64;
    }

    this.employeeService.updateEmployee(this.employeeId, input).subscribe({
      next: (result: any) => {
        this.submitting = false;
        console.log('UPDATE EMPLOYEE RESULT:', result);

        const payload = result?.data?.updateEmployeeByEid;

        if (payload?.success) {
          this.successMessage = payload.message || 'Employee updated successfully';

          setTimeout(() => {
            this.router.navigate(['/employees']);
          }, 1200);
        } else {
          this.errorMessage = payload?.message || 'Failed to update employee';
        }
      },
      error: (err) => {
        this.submitting = false;
        console.log('UPDATE EMPLOYEE ERROR:', err);

        if (err?.graphQLErrors?.length) {
          this.errorMessage = err.graphQLErrors[0].message;
        } else if (err?.networkError?.result?.errors?.length) {
          this.errorMessage = err.networkError.result.errors[0].message;
        } else {
          this.errorMessage = err.message || 'Failed to update employee';
        }
      }
    });
  }
}