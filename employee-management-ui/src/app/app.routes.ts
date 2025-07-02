import { Routes } from '@angular/router';

// Components
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { EmployeesComponent } from './pages/employees/employees.component';
import { EmployeeCreateComponent } from './pages/employee-create/employee-create.component';
import { EditEmployeeComponent } from './pages/edit-employee/edit-employee.component';
import { DepartmentComponent } from './pages/departments/departments.component';
import { DepartmentListComponent } from './pages/department-list/department-list.component';
import { DepartmentEditComponent } from './pages/department-edit/department-edit.component';
import { DepartmentDeleteComponent } from './pages/department-delete/department-delete.component';
import { HomeComponent } from './pages/home/home.component';
import { FilesComponent } from './pages/files/files.component'; // update path if different
  import { LeavesComponent } from './pages/leaves/leaves.component';
import { PerformanceComponent } from './pages/performance/performance.component';
import { LeaveRequestComponent } from './pages/leave-request/leave-request.component';
import { DepartmentCreateComponent } from './pages/department-create/department-create.component';
import { AuditLogComponent } from './pages/audit-log/audit-log.component';
import { PerformanceReviewComponent } from './pages/performance-review/performance-review.component'; // ✅ Correct path
export const routes: Routes = [
   { path: '', component: HomeComponent },

  // Auth
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  // Dashboard
  { path: 'dashboard', component: DashboardComponent },

  // Employees
  { path: 'employees', component: EmployeesComponent },
  { path: 'employees/create', component: EmployeeCreateComponent },
  { path: 'employees/edit/:id', component: EditEmployeeComponent },

  // Departments
  { path: 'departments', component: DepartmentComponent },
  { path: 'departments/list', component: DepartmentListComponent },
   { path: 'department/edit/:id', component: DepartmentEditComponent },
  { path: 'department/delete/:id', component: DepartmentDeleteComponent },
    {
    path: 'upload-file',
    component: FilesComponent,
  },
  { path: 'leave-request', component: LeaveRequestComponent },

{ path: 'leaves', component: LeavesComponent },


 { path: 'departments/create', component: DepartmentCreateComponent },
  // other routes...
  { path: 'performance', component: PerformanceComponent },

{ path: 'audit-logs', component: AuditLogComponent },
 { path: 'reviews', component: PerformanceReviewComponent }, 
];
