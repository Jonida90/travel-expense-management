import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private users = [
    { username: 'enduser', password: '123', role: 'EndUser' },
    { username: 'approver', password: '123', role: 'Approver' },
    { username: 'finance', password: '123', role: 'Finance' },
  ];
  private currentUser: any = null;

  constructor(private router: Router) {}

  login(username: string, password: string): boolean {
    const user = this.users.find(
      u => u.username === username && u.password === password
    );
    if (user) {
      this.currentUser = user;
      localStorage.setItem('currentUser', JSON.stringify(user));
      return true;
    }
    return false;
  }

  logout() {
    this.currentUser = null;
    localStorage.removeItem('currentUser');
    this.router.navigate(['/login']);
  }

  getCurrentUser() {
    return this.currentUser || JSON.parse(localStorage.getItem('currentUser')!);
  }

  isAuthenticated(): boolean {
    return !!this.getCurrentUser();
  }
}
