import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, GuardResult, MaybeAsync, Router, RouterStateSnapshot } from '@angular/router';
import { TokenService } from '../services/token.service';


@Injectable({
  providedIn: 'root'
})

export class AuthGuard implements CanActivate {
    constructor(private tokenService: TokenService, private router: Router) {
    }

    canActivate() : boolean {
        if(!this.tokenService.getToken()) {
            this.router.navigate(['/login']);
            return false;
        }
        return true;
    }
}