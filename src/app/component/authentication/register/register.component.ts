import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/service/auth/auth.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { PasswordValidation } from '../../../core/helper/password-validation';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  myForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public authService: AuthService) { }

  ngOnInit() {
    this.myForm = this.fb.group({
      email: ['', [Validators.required, Validators.pattern('[a-z0-9.@]*')]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    }, { 
      validator: PasswordValidation.MatchPassword
    });
  }

  onSubmit(myForm) {
    const email = myForm.value.email;
    const password = myForm.value.password;
    console.log(email);
    console.log(password);
    this.authService.signUp(email, password);
  }
}
