import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const isAuthenticated = this.authService.isAuthenticated();
    const userData = localStorage.getItem('userData');
    const user = userData ? JSON.parse(userData) : null;
  
    if (isAuthenticated && user) {
      const allowedRoles = route.data['roles'] as string[];
  
      if (allowedRoles.includes(user.role)) {
        return true;
      }
    }
    this.router.navigate(['/login']);
    this.authService.isLoggedInSubject.next(false);
    return false;
  }
}
