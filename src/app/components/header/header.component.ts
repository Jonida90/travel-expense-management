import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  userName: string = '';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    // Fetch logged-in user details
    this.userName = "jonidaaaaaaaaaaaaaaa";
    //this.authService.getLoggedInUserName(); // Ensure `getLoggedInUserName()` exists
  }

  logout(): void {
    this.authService.logout();
  }
}
