import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { EmployeeService } from '../../core/services/employee';

@Component({
  selector: 'app-employee-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './employee-details.html',
  styleUrl: './employee-details.css'
})
export class EmployeeDetails implements OnInit {
  employee: any = null;
  loading = true;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private employeeService: EmployeeService
  ) {}

  ngOnInit(): void {
    const eid = this.route.snapshot.paramMap.get('id');

    if (!eid) {
      this.loading = false;
      this.errorMessage = 'Employee ID not found';
      return;
    }

    this.employeeService.getEmployeeById(eid).subscribe({
      next: (result: any) => {
        this.loading = false;
        console.log('EMPLOYEE DETAILS RESULT:', result);

        const payload = result?.data?.searchEmployeeByEid;

        if (payload?.success) {
          this.employee = payload.employee;
        } else {
          this.errorMessage = payload?.message || 'Failed to load employee details';
        }
      },
      error: (err) => {
        this.loading = false;
        console.log('EMPLOYEE DETAILS ERROR:', err);

        if (err?.graphQLErrors?.length) {
          this.errorMessage = err.graphQLErrors[0].message;
        } else if (err?.networkError?.result?.errors?.length) {
          this.errorMessage = err.networkError.result.errors[0].message;
        } else {
          this.errorMessage = err.message || 'Failed to load employee details';
        }
      }
    });
  }

  handleImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = 'https://via.placeholder.com/150';
  }
}