import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Components
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { BookListComponent } from './books/book-list/book-list.component';
import { BookAddComponent } from './books/book-add/book-add.component';
import { CartComponent } from './cart/cart.component';
import { OrderListComponent } from './orders/order-list/order-list.component';
import { OrderDetailComponent } from './orders/order-detail/order-detail.component';
import { UserManagementComponent } from './admin/user-management/user-management.component';
import { UnauthorizedComponent } from './shared/components/unauthorized/unauthorized.component';

// Guards
import { AuthGuard } from './shared/guards/auth.guard';
import { RoleGuard } from './shared/guards/role.guard';

const routes: Routes = [
  { path: '', redirectTo: '/books', pathMatch: 'full' },
  
  // Public Routes
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'books', component: BookListComponent },
  { path: 'unauthorized', component: UnauthorizedComponent },
  
  // Protected Routes (User)
  { 
    path: 'cart', 
    component: CartComponent, 
    canActivate: [AuthGuard] 
  },
  { 
    path: 'orders', 
    component: OrderListComponent, 
    canActivate: [AuthGuard] 
  },
  { 
    path: 'orders/:id', 
    component: OrderDetailComponent, 
    canActivate: [AuthGuard] 
  },
  
  // Admin Routes
  { 
    path: 'admin/books/add', 
    component: BookAddComponent, 
    canActivate: [AuthGuard, RoleGuard],
    data: { expectedRole: 'Admin' }
  },
  { 
    path: 'admin/books/edit/:id', 
    component: BookAddComponent, 
    canActivate: [AuthGuard, RoleGuard],
    data: { expectedRole: 'Admin' }
  },
  { 
    path: 'admin/users', 
    component: UserManagementComponent, 
    canActivate: [AuthGuard, RoleGuard],
    data: { expectedRole: 'Admin' }
  },
  
  // Wildcard route
  { path: '**', redirectTo: '/books' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
