import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { TokenService } from '../services/token.service';

@Injectable({
    providedIn: 'root'
})
export class StudentGuard implements CanActivate {
    constructor(private tokenService: TokenService, private router: Router) {
    }

    canActivate(): boolean {
        console.log('Hi')
        const userRole = this.tokenService.getUserRole();
        if (userRole !== 'Student') {
            this.router.navigate(['/unauthorize']);
            return false;
        }

        return true;
    }
}