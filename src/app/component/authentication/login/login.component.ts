import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/service/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(public authService: AuthService, private router: Router) { }

  ngOnInit() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      if (user.role == 'provider') {
        localStorage.removeItem('user');
      } else if (user.role == 'user') {
        this.router.navigate(['/dashboard/device']);
      }
    }
  }

  keyDownFunction(event, user: string, pass: string) {
    if (event.keyCode == 13) {
      this.authService.signIn(user, pass);
    }
  }
}
