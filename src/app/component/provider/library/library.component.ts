import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/service/auth/auth.service';
import { User } from 'src/app/core/object/user/user';
import { ApiService } from 'src/app/core/service/api/api.service';
import { Library } from 'src/app/core/object/library/library';
import { AlertService } from 'ngx-alerts';
import { InfoDevice, Info } from 'src/app/core/object/info-device/info-device';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-library',
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.css']
})
export class LibraryComponent implements OnInit, OnDestroy {

  private subscriptionsUser: Subscription[] = [];

  items: User;
  myForm: FormGroup;
  listHub: any = ['ESP32', 'ESP8266', 'RASPBIAN'];
  library: Library;
  infoDevice: Info;

  constructor(
    private authService: AuthService,
    private apiService: ApiService,
    public fb: FormBuilder,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    this.myForm = this.fb.group({
      device: ['', Validators.required],
    })
  }

  ngOnDestroy() {
    this.subscriptionsUser.forEach(subscriptionUser => subscriptionUser.unsubscribe());
  }

  /* To copy Text from Textbox */
  copyInputMessage(inputElement) {
    inputElement.select();
    document.execCommand('copy');
    inputElement.setSelectionRange(0, 0);
    this.alertService.success('Save to clipboard!');
  }

  onSubmit(myForm) {
    const device = myForm.value.device;
    const number = '1';
    this.authService.afs
      .collection('users')
      .doc(`/${this.authService.afAuth.auth.currentUser.uid}`)
      .snapshotChanges()
      .subscribe(snapshots => {
        this.items = snapshots.payload.data();
        const location = this.items.location;
        const name = this.items.displayName;
        const company = this.items.company;
        this.apiService.registerLibrary(name, company, location, device, number).subscribe((data: Library) => {
          if (data.error == true) {
            this.alertService.danger(data.message);
          } else if (data.error == false) {
            this.library = data;
            this.alertService.success('Success!');
            if (device == 'RASPBIAN') {
              this.subscriptionsUser.push(this.getInfoDevice('RPI3'));
            } else {
              this.subscriptionsUser.push(this.getInfoDevice(device));
            }
          }
        });
      });
  }

  getInfoDevice(type: string) {
    return this.apiService.getInfoDevice(type).subscribe((data: InfoDevice) => {
      if (data.error == true) {
        this.alertService.danger(data.message);
      } else if (data.error == false) {
        this.infoDevice = data.info;
      }
    });
  }
}
