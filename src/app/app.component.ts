import { Component } from '@angular/core';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public isLoggedIn: boolean = true;

  constructor(private authService: AuthService) {
    // this.authService.isLoggedIn$.subscribe((status) => {
    //   this.isLoggedIn = status;
    // });
  }
}
