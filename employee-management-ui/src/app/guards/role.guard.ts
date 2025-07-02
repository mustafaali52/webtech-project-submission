import { Injectable } from '@angular/core';
import { CanActivateFn } from '@angular/router';

export function RoleGuard(expectedRoles: string[]): CanActivateFn {
  return () => {
    const token = localStorage.getItem('token');
    if (!token) return false;

    const payload = JSON.parse(atob(token.split('.')[1]));
    const role = payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];

    return expectedRoles.includes(role);
  };
}
