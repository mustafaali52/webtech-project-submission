
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { TokenService } from '../services/token.service';

@Injectable({
    providedIn: 'root'
})
export class TeacherGuard implements CanActivate {
    constructor(private tokenService: TokenService, private router: Router) {
    }

    canActivate(): boolean {
        console.log('Hi')
        const userRole = this.tokenService.getUserRole();
        if (userRole !== 'Teacher') {
            this.router.navigate(['/unauthorized']);
            return false;
        }

        return true;
    }
}