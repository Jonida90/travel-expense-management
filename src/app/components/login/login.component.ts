import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  onSubmit() {
    const { username, password } = this.loginForm.value;

    this.authService.login(username);
// if (userRole === 'admin') {
//   this.router.navigate(['/admin-dashboard']);
// } else if (userRole === 'user') {
//   this.router.navigate(['/user-dashboard']);
// }
//     if (this.authService.login(username, password)) {
//       // Redirect based on role
//     } else {
//       alert('Invalid credentials');
//     }
  }
}
