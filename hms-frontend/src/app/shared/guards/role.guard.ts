import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const expectedRoles = route.data['role'];
    const userRole = localStorage.getItem('role');

    if (!userRole) {
      this.router.navigate(['/unauthorized']);
      return false;
    }

    // Handle both string and array of roles
    const isAuthorized = Array.isArray(expectedRoles)
      ? expectedRoles.includes(userRole)
      : userRole === expectedRoles;

    if (!isAuthorized) {
      this.router.navigate(['/unauthorized']);
    }

    return isAuthorized;
  }
}
