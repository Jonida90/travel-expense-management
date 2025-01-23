import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  private currentUser: any = null;
  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  constructor(private router: Router) {}

  login(userData: any): void {
    localStorage.setItem('userData', JSON.stringify(userData));
    this.currentUser = userData;
    this.isLoggedInSubject.next(true);
  }

  logout(): void {
    localStorage.removeItem('userData');
    this.isLoggedInSubject.next(false);
  }

  getLoggedInUserName(): string {

    const userData = localStorage.getItem('userData');
    const user = userData ? JSON.parse(userData) : null;
    return user ? user.username : '';
  }


  getCurrentUser() {
    const userData = localStorage.getItem('userData');
    return this.currentUser || JSON.parse(userData!);
  }

  isAuthenticated(): boolean {
    return !!this.getCurrentUser();
  }
}
