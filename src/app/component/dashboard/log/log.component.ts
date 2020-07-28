import { Component, OnInit, NgZone, OnDestroy } from '@angular/core';
import { ApiService } from 'src/app/core/service/api/api.service';
import { Router } from '@angular/router';
import { User } from 'src/app/core/object/user/user';
import { Subscription } from 'rxjs';
import { Table } from 'src/app/core/object/table/table';
import * as moment from 'moment';
import { TableRpi } from 'src/app/core/object/table-rpi/table-rpi';
import { GetDevices, Devices, LogDevices } from 'src/app/core/object/get-devices/get-devices';
import { AuthService } from 'src/app/core/service/auth/auth.service';

@Component({
  selector: 'app-log',
  templateUrl: './log.component.html',
  styleUrls: ['./log.component.css']
})
export class LogComponent implements OnInit, OnDestroy {

  private subscriptionsUser: Subscription[] = [];

  recordLivingRoom: Table[] = [];
  recordBedRoom: Table[] = [];
  recordGarden: Table[] = [];
  recordToilet: TableRpi[] = [];
  recordAll: any[] = [];
  userData: User;
  listDevicesControl: GetDevices;
  listDevices: Devices[] = [];
  selectedHub: Devices;

  settings = {
    columns: {
      deviceID: {
        title: 'ID'
      },
      MAC: {
        title: 'MAC'
      },
      flashChipSize: {
        title: 'Size'
      },
      freeHeapSize: {
        title: 'Free'
      },
      ipAddress: {
        title: 'IP'
      },
      ssidConnected: {
        title: 'WiFi'
      },
      timestamp: {
        title: 'date',
        type: 'text',
        valuePrepareFunction: (cell, row) => {
          return moment.unix(row.timestamp).format("DD/MM/YYYY hh:mm");
        },
        filterFunction: (cell?: any, search?: string) => {
          // cell? is the value of the cell, in this case is a timeStamp
          if (search.length > 0) {
            return moment.unix(cell).format("DD/MM/YYYY hh:mm").match(search);
          }
        },
        sortDirection: 'desc'
      },
    },
    hideSubHeader: false, // hide filter row
    actions: false, // hide action column
  };

  settingsRPI = {
    columns: {
      deviceId: {
        title: 'ID'
      },
      MAC: {
        title: 'MAC'
      },
      deviceCpuUsed: {
        title: 'CPU Used'
      },
      deviceTemp: {
        title: 'CPU Temp'
      },
      deviceRAMInfo: {
        title: 'CPU RAM'
      },
      ipAddress: {
        title: 'IP'
      },
      ssidConnected: {
        title: 'WiFi'
      },
      timestamp: {
        title: 'date',
        type: 'text',
        valuePrepareFunction: (cell, row) => {
          return moment.unix(row.timestamp).format("DD/MM/YYYY hh:mm");
        },
        filterFunction: (cell?: any, search?: string) => {
          // cell? is the value of the cell, in this case is a timeStamp
          if (search.length > 0) {
            return moment.unix(cell).format("DD/MM/YYYY hh:mm").match(search);
          }
        },
        sortDirection: 'desc'
      }
    },
    hideSubHeader: false, // hide filter row
    actions: false, // hide action column
  };

  constructor(private apiService: ApiService,
    public authService: AuthService,
    public router: Router,
    public ngZone: NgZone) {
  }

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
        }
        this.subscriptionsUser.push(this.getAllLog(this.listDevicesControl.devices[i].id, user));
      }
    });
  }

  getAllLog(apikey: string, user: string) {
    return this.apiService.getAllLog(apikey, user).subscribe((data: LogDevices) => {
      for (let i = 0; i < data.log.length; i++) {
        if (data.log[0].name == "Living Room") {
          this.recordLivingRoom = data.log;
          break;
        } else if (data.log[0].name == "Bed Room") {
          this.recordBedRoom = data.log;
          break;
        } else if (data.log[0].name == "Garden") {
          this.recordGarden = data.log;
          break;
        } else if (data.log[0].name == "Toilet") {
          this.recordToilet = data.log;
          break;
        }
      }
    })
  }
}
