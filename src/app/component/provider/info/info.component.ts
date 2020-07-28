import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/core/service/auth/auth.service';
import { Subscription } from 'rxjs';
import { ResizeOptions, ImageResult } from 'ng2-imageupload';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AlertService } from 'ngx-alerts';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.css']
})
export class InfoComponent implements OnInit, OnDestroy {

  private subscriptionsUser: Subscription[] = [];

  imageForm: FormGroup;
  userForm: FormGroup;
  src: any;

  resizeOptions: ResizeOptions = {
    resizeMaxHeight: 1600,
    resizeMaxWidth: 1600
  };

  selected(imageResult: ImageResult) {
    this.src = imageResult.resized
      && imageResult.resized.dataURL
      || imageResult.dataURL;
  }

  constructor(
    public authService: AuthService,
    private alertService: AlertService,
    public fb: FormBuilder
  ) { }

  ngOnInit() {
    this.imageForm  = this.fb.group({
      photo: ['', Validators.required],
    });
    this.userForm  = this.fb.group({
      name: ['', Validators.required],
      company: ['', Validators.required],
      location: ['', Validators.required],
    });
  }

  ngOnDestroy() {
    this.subscriptionsUser.forEach(subscriptionUser => subscriptionUser.unsubscribe());
  }

  onSubmitImage() {
    this.authService.updateImageUser(this.authService.afAuth.auth.currentUser.uid, this.src);
  }

  onSubmitUser(userForm) {
    if (userForm.valid) {
      const name = userForm.controls.name.value;
      const company = userForm.controls.company.value;
      const location = userForm.controls.location.value;
      this.authService.updateUser(this.authService.afAuth.auth.currentUser.uid, name, company, location);
    }
  }
}
