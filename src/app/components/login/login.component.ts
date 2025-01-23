import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IUser } from 'src/app/core/interfaces/user.interface';
import { AuthService } from 'src/app/core/services/auth.service';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  public loginForm: FormGroup;
  public errorMessage: string = '';

  constructor(private fb: FormBuilder, private authService: AuthService, 
    private userService: UserService, private router: Router) {
    this.authService.isLoggedInSubject.next(false);
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  onSubmit() {

    const { username, password } = this.loginForm.value;

    this.userService.getUsers().subscribe(
      (users: IUser[]) => {
        const user = users.find(u => u.username === username && u.password === password);

        if (user) {
          this.authService.login(user);
          if (user.role === 'END_USER') {
            this.router.navigate(['/user']);
          } else if (user.role === 'APPROVER') {
            this.router.navigate(['/approver']);
          } else {
            this.router.navigate(['/finance']);
          }
        } else {
          this.errorMessage = 'Invalid username or password!';
        }
      },
      () => {
        this.errorMessage = 'An error occurred while logging in.';
      }
    );
  }
}
