import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/service/auth/auth.service';

import { PasswordValidation } from '../../../core/helper/password-validation';

@Component({
  selector: 'app-register-provider',
  templateUrl: './register-provider.component.html',
  styleUrls: ['./register-provider.component.css']
})
export class RegisterProviderComponent implements OnInit {

  myForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService
    ) { }

  ngOnInit() {
    this.myForm = this.fb.group({
      email: ['', [Validators.required, Validators.pattern('[a-z0-9.@]*')]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      name: ['', Validators.required],
      company: ['', Validators.required],
      location: ['', Validators.required]
    }, { 
      validator: PasswordValidation.MatchPassword
    });
  }

  onSubmit(myForm) {
    const email = myForm.value.email;
    const password = myForm.value.password;
    const name = myForm.value.name;
    const company = myForm.value.company;
    const location = myForm.value.location;
    this.authService.signUpProvider(email, password, name, company, location);
  }
}
