import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Signup } from './pages/signup/signup';
import { EmployeeList } from './pages/employee-list/employee-list';
import { AddEmployee} from './pages/add-employee/add-employee';
import { EmployeeDetails } from './pages/employee-details/employee-details';
import { UpdateEmployee } from './pages/update-employee/update-employee';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'signup', component: Signup },
  { path: 'employees', component: EmployeeList  , canActivate: [authGuard]},
  { path: 'employees/add', component: AddEmployee , canActivate: [authGuard]},
  { path: 'employees/:id', component: EmployeeDetails , canActivate: [authGuard]},
  { path: 'employees/edit/:id', component: UpdateEmployee , canActivate: [authGuard]},
  { path: '**', redirectTo: 'login' }
];