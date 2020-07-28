import { Component, OnInit, NgZone, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/core/service/auth/auth.service';
import { FormGroup, FormBuilder, Validators, FormControl, NgForm } from '@angular/forms';
import { ResizeOptions, ImageResult } from 'ng2-imageupload';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit, OnDestroy {

  private subscriptions: Subscription[] = [];

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

  constructor(public authService: AuthService,
    public router: Router,
    public ngZone: NgZone,
    private fb: FormBuilder) { }

  ngOnInit() {
  }

  ngOnDestroy() {
  }

  changeImage() {
    this.authService.updateImageUser(this.authService.afAuth.auth.currentUser.uid, this.src);
  }

  onSubmit(form: NgForm) {
    if (form.valid) {
      this.authService.updateNameUser(this.authService.afAuth.auth.currentUser.uid, form.controls.userName.value);
    }
  }
}
