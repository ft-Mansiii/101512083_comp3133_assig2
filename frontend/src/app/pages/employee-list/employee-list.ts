import { Component, OnInit } from '@angular/core';
import { CommonModule  } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { EmployeeService } from '../../core/services/employee';
import { CapitalizePipe } from '../../shared/pipes/capitalize-pipe';
import { AuthService } from '../../core/services/auth';


@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, CapitalizePipe],
  templateUrl: './employee-list.html',
  styleUrl: './employee-list.css'
})


export class EmployeeList implements OnInit {
  employees: any[] = [];
  loading = true;
  errorMessage = '';
  designationSearch = '';
  departmentSearch = '';

  constructor(
    private employeeService: EmployeeService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.loading = true;
    this.errorMessage = '';

    this.employeeService.getAllEmployees().subscribe({
      next: (result: any) => {
        this.loading = false;
        console.log('EMPLOYEE RESULT FULL:', result);

        const payload = result?.data?.getAllEmployees;

        if (!payload) {
          this.errorMessage = 'No response payload received';
          return;
        }

        if (payload.success) {
          this.employees = payload.employees || [];
          this.errorMessage = '';
        } else {
          this.employees = [];
          this.errorMessage = payload.message || 'Failed to load employees';
        }
      },
      error: (err) => {
        this.loading = false;
        console.log('EMPLOYEE LIST ERROR FULL:', err);

        if (err?.graphQLErrors?.length) {
          this.errorMessage = err.graphQLErrors[0].message;
        } else if (err?.networkError?.result?.errors?.length) {
          this.errorMessage = err.networkError.result.errors[0].message;
        } else if (err?.error?.errors?.length) {
          this.errorMessage = err.error.errors[0].message;
        } else {
          this.errorMessage = err.message || 'Failed to load employees';
        }
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
  handleImageError(event: Event): void {
  const img = event.target as HTMLImageElement;
  img.src = 'https://via.placeholder.com/50';
  }

  confirmDeleteId: string | null = null;

startDelete(id: string): void {
  this.confirmDeleteId = id;
}

cancelDelete(): void {
  this.confirmDeleteId = null;
}

confirmDelete(id: string): void {
  this.employeeService.deleteEmployee(id).subscribe({
    next: (result: any) => {
      const payload = result?.data?.deleteEmployeeByEid;

      if (payload?.success) {
        this.confirmDeleteId = null;
        this.loadEmployees();
      } else {
        this.errorMessage = payload?.message || 'Failed to delete employee';
      }
    },
    error: (err) => {
      if (err?.graphQLErrors?.length) {
        this.errorMessage = err.graphQLErrors[0].message;
      } else if (err?.networkError?.result?.errors?.length) {
        this.errorMessage = err.networkError.result.errors[0].message;
      } else {
        this.errorMessage = err.message || 'Failed to delete employee';
      }
    }
  });
}

searchEmployees(): void {
  const designation = this.designationSearch.trim();
  const department = this.departmentSearch.trim();

  if (!designation && !department) {
    this.loadEmployees();
    return;
  }

  this.loading = true;
  this.errorMessage = '';

  this.employeeService.searchEmployees(designation, department).subscribe({
    next: (result: any) => {
      this.loading = false;
      console.log('SEARCH EMPLOYEE RESULT:', result);

      const payload = result?.data?.searchEmployeeByDesignationOrDepartment;

      if (payload?.success) {
        this.employees = payload.employees || [];
      } else {
        this.employees = [];
        this.errorMessage = payload?.message || 'No employees found';
      }
    },
    error: (err) => {
      this.loading = false;
      console.log('SEARCH EMPLOYEE ERROR:', err);

      if (err?.graphQLErrors?.length) {
        this.errorMessage = err.graphQLErrors[0].message;
      } else if (err?.networkError?.result?.errors?.length) {
        this.errorMessage = err.networkError.result.errors[0].message;
      } else {
        this.errorMessage = err.message || 'Search failed';
      }
    }
  });
}

resetSearch(): void {
  this.designationSearch = '';
  this.departmentSearch = '';
  this.loadEmployees();
}


}