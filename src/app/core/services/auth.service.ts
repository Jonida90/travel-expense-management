import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  private users = [
    { username: 'enduser', password: '123', role: 'EndUser' },
    { username: 'approver', password: '123', role: 'Approver' },
    { username: 'finance', password: '123', role: 'Finance' },
  ];
  private currentUser: any = null;

  constructor(private router: Router) {}

  // login(username: string, password: string): boolean {
  //   const user = this.users.find(
  //     u => u.username === username && u.password === password
  //   );
  //   if (user) {
  //     this.currentUser = user;
  //     localStorage.setItem('currentUser', JSON.stringify(user));
  //     return true;
  //   }
  //   return false;
  // }

  // login(userName: string, pass?: string): void {
  //   localStorage.setItem('userName', userName);
  //   localStorage.setItem('userRole', userData.userRole);
  //   this.isLoggedInSubject.next(true);
  // }

  login(userData: { userName: string; userRole: string; token: string }): void {
    localStorage.setItem('userName', userData.userName);
    localStorage.setItem('userRole', userData.userRole);
    localStorage.setItem('token', userData.token);
    this.isLoggedInSubject.next(true);
  }

  logout(): void {
    localStorage.removeItem('userName');
    this.isLoggedInSubject.next(false);
  }

  getLoggedInUserName(): string {
    return localStorage.getItem('userName') || '';
  }

  // logout() {
  //   this.currentUser = null;
  //   localStorage.removeItem('currentUser');
  //   this.router.navigate(['/login']);
  // }

  getCurrentUser() {
    return this.currentUser || JSON.parse(localStorage.getItem('currentUser')!);
  }

  isAuthenticated(): boolean {
    return !!this.getCurrentUser();
  }
}
