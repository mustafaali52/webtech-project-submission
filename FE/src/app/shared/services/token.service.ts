import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { jwtDecode } from 'jwt-decode';

@Injectable({
    providedIn: 'root'
})
export class TokenService {
    private tokenKey = 'authToken';
    private isBrowser: boolean;

    constructor(@Inject(PLATFORM_ID) platformId: Object) {
        this.isBrowser = isPlatformBrowser(platformId);
    }

    setToken(token: string): void {
        if (this.isBrowser) {
            localStorage.setItem(this.tokenKey, token);
        }
    }

    getToken(): string | null {
        return this.isBrowser ? localStorage.getItem(this.tokenKey) : null;
    }

    removeToken(): void {
        if (this.isBrowser) {
            localStorage.removeItem(this.tokenKey);
        }
    }

    isAuthenticated(): boolean {
        return !!this.getToken();
    }

    getUserName(): string | null {
        if (!this.isBrowser) return null;

        const token = this.getToken();
        if (!token) return null;

        try {
            const decodedToken: any = jwtDecode(token);
            console.log(decodedToken)
            return decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] || null;
        } catch (error) {
            console.error('Error decoding token:', error);
            return null;
        }
    }

    getUserRole(): string | null {
        if (!this.isBrowser) return null;

        const token = this.getToken();
        if (!token) return null;

        try {
            const decoded: any = jwtDecode(token);
            console.log(decoded)
            return decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || null;
        } catch (error) {
            console.error('Error decoding token:', error);
            return null;
        }
    }

    getId(): string | null {
        if (!this.isBrowser) return null;

        const token = this.getToken();
        if (!token) return null;

        try {
            const decoded: any = jwtDecode(token);
            // Try common claim keys for user ID; adjust as needed
            console.log(decoded)
            return decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier']
                || decoded['sub']
                || null;
        } catch (error) {
            console.error('Error decoding token:', error);
            return null;
        }
    }

    isTeacher(): boolean {
        return this.getUserRole() === 'Teacher';
    }

    isStudent(): boolean {
        return this.getUserRole() === 'Student';
    }

    isTeacherOrStudent(): boolean {
        const role = this.getUserRole();
        return role === 'Teacher' || role === 'Student';
    }
}
