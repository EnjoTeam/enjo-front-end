import { Component, OnInit, NgZone, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { User } from 'src/app/core/object/user/user';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/core/service/api/api.service';
import { GetDevices, Devices } from 'src/app/core/object/get-devices/get-devices';
import * as moment from 'moment';
import { AuthService } from 'src/app/core/service/auth/auth.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit, OnDestroy {

  private subscriptionsUser: Subscription[] = [];

  userData: User;
  mySubscription: any;
  listDevicesControl: GetDevices;
  listDevices: Devices[] = [];
  history: [] = [];
  selectedHub: Devices;

  constructor(private apiService: ApiService,
    public authService: AuthService,
    public router: Router,
    public ngZone: NgZone) { }

  ngOnInit() {
    this.subscriptionsUser.push(this.getListDeviceControl(this.authService.afAuth.auth.currentUser.uid));
  }

  ngOnDestroy() {
    this.subscriptionsUser.forEach(subscriptionUser => subscriptionUser.unsubscribe());
  }

  getListDeviceControl(user: string) {
    return this.apiService.getListDeviceControl(user).subscribe((data: GetDevices) => {
      this.listDevicesControl = data;
      for (let i = 0; i < this.listDevicesControl.devices.length; i++) {
        if (i == 0) {
          this.selectedHub = this.listDevicesControl.devices[i];
          break;
        }        
      }
    });
  }
}
