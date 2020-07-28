import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/service/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-provider',
  templateUrl: './login-provider.component.html',
  styleUrls: ['./login-provider.component.css']
})
export class LoginProviderComponent implements OnInit {

  myForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
    ) { }

  ngOnInit() {
    this.myForm = this.fb.group({
      email: ['', [Validators.required, Validators.pattern('[a-z0-9.@]*')]],
      password: ['', Validators.required],
    });
    const user =  JSON.parse(localStorage.getItem('user'));
    if(user) {
      if(user.role == 'user') {
        localStorage.removeItem('user');
      } else if (user.role == 'provider') {
        this.router.navigate(['/provider/library']);
      }
    }
  }

  onSubmit(myForm) {
    const email = myForm.value.email;
    const password = myForm.value.password;
    this.authService.signInProvider(email, password);
  }
}
