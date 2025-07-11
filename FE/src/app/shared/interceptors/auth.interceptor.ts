import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { TokenService } from '../services/token.service';


export const authInterceptor: HttpInterceptorFn = (req, next) => { 
    const tokenService = inject(TokenService);
    const token = tokenService.getToken();
    console.log(token)
    if (token) {
        const authReq = req.clone({
            setHeaders: {
                Authorization: `${token}`
            }
        });
        return next(authReq);
    }

    return next(req);
}