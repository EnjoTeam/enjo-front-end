import { Component, OnInit, NgZone, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/core/service/api/api.service';
import { GetDevices, Devices, TypeDevices } from 'src/app/core/object/get-devices/get-devices';
import { AuthService } from 'src/app/core/service/auth/auth.service';
import { AlertService } from 'ngx-alerts';

@Component({
  selector: 'app-monitor',
  templateUrl: './monitor.component.html',
  styleUrls: ['./monitor.component.css']
})
export class MonitorComponent implements OnInit, OnDestroy {

  private subscriptionsUser: Subscription[] = [];

  ledStatus: boolean;
  doorStatus: boolean;
  listDevicesControl: GetDevices;
  listDevices: Devices[] = [];

  constructor(private apiService: ApiService,
    public authService: AuthService,
    public router: Router,
    public ngZone: NgZone,
    public activatedRoute: ActivatedRoute,
    private alertService: AlertService) {
  }

  ngOnInit() {
    this.subscriptionsUser.push(this.getListDeviceControl(this.authService.afAuth.auth.currentUser.uid));
    this.subscriptionsUser.push(this.getStatusLed(this.authService.afAuth.auth.currentUser.uid));
    this.subscriptionsUser.push(this.getStatusDoor(this.authService.afAuth.auth.currentUser.uid));
  }

  ngOnDestroy() {
    this.subscriptionsUser.forEach(subscriptionUser => subscriptionUser.unsubscribe());
  }

  getListDeviceControl(user: string) {
    return this.apiService.getListDeviceControl(user).subscribe((data: GetDevices) => {
      if (data.error == true) {
        this.alertService.danger(data.message);
      } else if (data.error == false) {
        this.listDevicesControl = data;
      }
    });
  }

  getStatusLed(user: string) {
    return this.apiService.getListDeviceControl(user).subscribe((data: GetDevices) => {
      if (data.error == true) {
        this.alertService.danger(data.message);
      } else if (data.error == false) {
        this.listDevices = data.devices;
        for (let i = 0; i < this.listDevices.length; i++) {
          for (let j = 0; j < this.listDevices[i].devices.length; j++) {
            if (this.listDevices[i].devices[j].type.match('Led')) {
              if (this.listDevices[i].devices[j].status.match('on')) {
                this.ledStatus = true;
                //this.alertService.info('Light turned on!');
              } else if (this.listDevices[i].devices[j].status.match('off')) {
                this.ledStatus = false;
                //this.alertService.info('Light turned off!');
              }
            }
          }
        }
      }
    });
  }

  getStatusDoor(user: string) {
    return this.apiService.getListDeviceControl(user).subscribe((data: GetDevices) => {
      if (data.error == true) {
        this.alertService.danger(data.message);
      } else if (data.error == false) {
        this.listDevices = data.devices;
        for (let i = 0; i < this.listDevices.length; i++) {
          for (let j = 0; j < this.listDevices[i].devices.length; j++) {
            if (this.listDevices[i].devices[j].type.match('SG90')) {
              if (this.listDevices[i].devices[j].status.match('opened')) {
                this.doorStatus = true;
                //this.alertService.info('Door opened!');
              } else if (this.listDevices[i].devices[j].status.match('closed')) {
                this.doorStatus = false;
                //this.alertService.info('Door closed!');
              }
            }
          }
        }
      }
    });
  }

  controlLedDevice(device: string, ledStatus: boolean) {
    this.apiService.getListDeviceControl(this.authService.afAuth.auth.currentUser.uid).subscribe((data: GetDevices) => {
      if (data.error == true) {
        this.alertService.danger(data.message);
      } else if (data.error == false) {
        this.listDevices = data.devices;
        for (let i = 0; i < this.listDevices.length; i++) {
          for (let j = 0; j < this.listDevices[i].devices.length; j++) {
            if (this.listDevices[i].devices[j].nameDevice.match(device)) {
              if (ledStatus == true) {
                this.subscriptionsUser.push(this.updateControl(this.listDevices[i].id, this.authService.afAuth.auth.currentUser.uid, this.listDevices[i].devices[j].id, 'on', this.listDevices[i].devices[j].nameDevice + ' turned on', this.listDevices[i].devices[j].nameDevice, this.listDevices[i].devices[j].type, this.authService.afAuth.auth.currentUser.email));
              } else if (ledStatus == false) {
                this.subscriptionsUser.push(this.updateControl(this.listDevices[i].id, this.authService.afAuth.auth.currentUser.uid, this.listDevices[i].devices[j].id, 'off', this.listDevices[i].devices[j].nameDevice + ' turned off', this.listDevices[i].devices[j].nameDevice, this.listDevices[i].devices[j].type, this.authService.afAuth.auth.currentUser.email));
              }
            }
          }
        }
      }
    });
  }

  controlDoorDevice(device: string, doorStatus: boolean) {
    this.apiService.getListDeviceControl(this.authService.afAuth.auth.currentUser.uid).subscribe((data: GetDevices) => {
      if (data.error == true) {
        this.alertService.danger(data.message);
      } else if (data.error == false) {
        this.listDevices = data.devices;
        for (let i = 0; i < this.listDevices.length; i++) {
          for (let j = 0; j < this.listDevices[i].devices.length; j++) {
            if (this.listDevices[i].devices[j].nameDevice.match(device)) {
              if (doorStatus == true) {
                this.subscriptionsUser.push(this.updateControl(this.listDevices[i].id, this.authService.afAuth.auth.currentUser.uid, this.listDevices[i].devices[j].id, 'opened', this.listDevices[i].devices[j].nameDevice + ' is opened', this.listDevices[i].devices[j].nameDevice, this.listDevices[i].devices[j].type, this.authService.afAuth.auth.currentUser.email));
              } else if (doorStatus == false) {
                this.subscriptionsUser.push(this.updateControl(this.listDevices[i].id, this.authService.afAuth.auth.currentUser.uid, this.listDevices[i].devices[j].id, 'closed', this.listDevices[i].devices[j].nameDevice + ' is closed', this.listDevices[i].devices[j].nameDevice, this.listDevices[i].devices[j].type, this.authService.afAuth.auth.currentUser.email));
              }
            }
          }
        }
      }
    });
  }

  updateControl(apiKey: string, user: string, device: string, status: string, action: string, name: string, type: string, email: string) {
    return this.apiService.updateControl(apiKey, user, device, status, action, name, type, email).subscribe((data: any) => {
      if (data.error == true) {
        this.alertService.danger(data.message);
      } else if (data.error == false) {
        if (type.match('Led')) {
          this.alertService.success(type + ' ' + status);
        } else if (type.match('SG90')) {
          this.alertService.success(type + ' ' + status);
        }
      }
    });
  }
}
