import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, GuardResult, MaybeAsync, Router, RouterStateSnapshot } from '@angular/router';
import { TokenService } from '../services/token.service';


@Injectable({
  providedIn: 'root'
})

export class AdminGuard implements CanActivate {
    constructor(private tokenService: TokenService, private router: Router) {
    }

    canActivate() : boolean {
       console.log('Hi');
        const role = this.tokenService.getUserRole();
        console.log('Role:', role);
        console.log(role);
        if (role !== 'Admin') {
        this.router.navigate(['/unauthorized']);
        return false;
        }
        return true;
    }
}