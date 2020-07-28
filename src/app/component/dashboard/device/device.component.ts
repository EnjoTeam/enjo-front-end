import { Component, OnInit, ViewChild, NgZone, OnDestroy } from '@angular/core';
import { ApiService } from 'src/app/core/service/api/api.service';
import { GetDevices, Devices } from 'src/app/core/object/get-devices/get-devices';
import { Router } from '@angular/router';
import { User } from 'src/app/core/object/user/user';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/core/service/auth/auth.service';
import { ResizeOptions, ImageResult } from 'ng2-imageupload';
import { DomSanitizer } from '@angular/platform-browser';
import { AlertService } from 'ngx-alerts';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-device',
  templateUrl: './device.component.html',
  styleUrls: ['./device.component.css']
})
export class DeviceComponent implements OnInit, OnDestroy {

  private subscriptionsUser: Subscription[] = [];

  addForm: FormGroup;
  removeForm: FormGroup;
  editForm: FormGroup;
  devicesControl: GetDevices;
  listDevicesControl: GetDevices;
  passwordLog: string = "";
  passwordControl: string = "";
  apiKeyControl: string = "";
  selectedDeviceControl: any;
  removeDevice: any;
  editDevice: any;
  registeredDeviceControl: any;
  userData: User;
  src: string = "";

  config = {
    displayKey: 'name', // if objects array passed which key to be displayed defaults to description
    customComparator: () => { },
    search: true,
    limitTo: 5
  };

  resizeOptions: ResizeOptions = {
    resizeMaxHeight: 1600,
    resizeMaxWidth: 1600
  };

  selected(imageResult: ImageResult) {
    this.src = imageResult.resized
      && imageResult.resized.dataURL
      || imageResult.dataURL;
  }

  constructor(private apiService: ApiService,
    public authService: AuthService,
    public router: Router,
    public ngZone: NgZone,
    private alertService: AlertService,
    public fb: FormBuilder) { }

  ngOnInit() {
    this.addForm  = this.fb.group({
      device: ['', Validators.required],
      password: ['', Validators.required],
      photo: ['', Validators.required],
    });
    this.removeForm  = this.fb.group({
      device: ['', Validators.required],
    });
    this.editForm  = this.fb.group({
      device: ['', Validators.required],
      photo: ['', Validators.required],
    });
    this.subscriptionsUser.push(this.getDeviceControl());
    this.subscriptionsUser.push(this.getListDeviceControl(this.authService.afAuth.auth.currentUser.uid));
  }

  ngOnDestroy() {
    this.subscriptionsUser.forEach(subscriptionUser => subscriptionUser.unsubscribe());
  }

  onSubmitAdd(addForm) {
    this.apiService.getListDeviceControl(this.authService.afAuth.auth.currentUser.uid).subscribe((data: GetDevices) => {
      this.listDevicesControl = data;
      const password = addForm.controls.password.value;
      const user = this.authService.afAuth.auth.currentUser.uid;
      const hubID = addForm.controls.device.value;
      const image = this.src;
      const mail = this.authService.afAuth.auth.currentUser.email;
      if (!image.startsWith('data:image')) {
        this.alertService.danger('Image only!');
        return;
      }
      for (let i = 0; i < this.listDevicesControl.devices.length; i++) {
        if(hubID === this.listDevicesControl.devices[i].id) {
          this.alertService.danger('This device is registered!');
          return;
        }
      }
      this.registerUserDeviceControl(hubID, password, user, image, mail);
    });
  }

  onSubmitRemove(removeForm) {
    const hubID = removeForm.controls.device.value;
    const user = this.authService.afAuth.auth.currentUser.uid;
    this.removeUserDeviceControl(hubID, user);
  }

  onSubmitEdit(editForm) {
    const hubID = editForm.controls.device.value;
    const user = this.authService.afAuth.auth.currentUser.uid;
    const image = this.src;
    this.editUserDeviceControl(hubID, user, image);
  }

  getDeviceControl() {
    return this.apiService.getDeviceControl().subscribe((data: GetDevices) => {
      this.devicesControl = data;
    });
  }

  registerUserDeviceControl(apiKey: string, password: string, user: string, image: string, mail: string) {
    return this.apiService.registerUserDeviceControl(apiKey, password, user, image, mail).subscribe((data: any) => {
      this.registeredDeviceControl = data;
      if (this.registeredDeviceControl.error == false) {
        this.alertService.success('Device is registered!');
        this.subscriptionsUser.push(this.getListDeviceControl(this.authService.afAuth.auth.currentUser.uid));
      } else if (this.registeredDeviceControl.error == true) {
        this.alertService.danger(this.registeredDeviceControl.message);
      }
    });
  }

  getListDeviceControl(user: string) {
    return this.apiService.getListDeviceControl(user).subscribe((data: GetDevices) => {
      this.listDevicesControl = data;
    });
  }

  searchChange($event) {
  }

  removeUserDeviceControl(apiKey: string, user: string) {
    return this.apiService.removeUserDeviceControl(apiKey, user).subscribe((data: any) => {
      if (data.error == false) {
        this.alertService.success('Device is removed!');
        this.subscriptionsUser.push(this.getListDeviceControl(this.authService.afAuth.auth.currentUser.uid));
      } else if (data.error == true) {
        this.alertService.danger(data.message);
      }
    });
  }

  editUserDeviceControl(apiKey: string, user: string, image: string) {
    return this.apiService.editUserDeviceControl(apiKey, user, image).subscribe((data: any) => {
      if (data.error == false) {
        this.alertService.success('Device is edited!');
        this.subscriptionsUser.push(this.getListDeviceControl(this.authService.afAuth.auth.currentUser.uid));
      } else if (data.error == true) {
        this.alertService.danger(data.message);
      }
    });
  }
}
