import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, GuardResult, MaybeAsync, Router, RouterStateSnapshot } from '@angular/router';
import { TokenService } from '../services/token.service';


@Injectable({
  providedIn: 'root'
})

export class VendorGuard implements CanActivate {
    constructor(private tokenService: TokenService, private router: Router) {
    }

    canActivate() : boolean {
        const role = this.tokenService.getUserRole();
        if (role !== 'Vendor') {
        this.router.navigate(['/unauthorized']);
        return false;
        }
        return true;
    }
}