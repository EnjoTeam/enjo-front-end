import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/core/service/api/api.service';
import { AuthService } from 'src/app/core/service/auth/auth.service';
import { AlertService } from 'ngx-alerts';
import { Subscription } from 'rxjs';
import { GetDevices, TypeDevices } from 'src/app/core/object/get-devices/get-devices';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { Rule } from 'src/app/core/object/rule/rule';

@Component({
  selector: 'app-rule',
  templateUrl: './rule.component.html',
  styleUrls: ['./rule.component.css']
})
export class RuleComponent implements OnInit {

  private subscriptionsUser: Subscription[] = [];

  hubID: string = '';
  deviceID: string = '';
  deviceList: TypeDevices[] = [];
  led: any = ['on', 'off'];
  servo: any = ['opened', 'closed'];
  statusArray: any[] = [];
  status: string = '';
  startTime: string;
  endTime: string;
  dayInWeek: string;
  dayInWeekID: string[] = [];
  listDevicesControl: GetDevices;
  dropdownList = [];
  selectedItems: any[] = [];
  dropdownSettings = {};
  rule: Rule;

  constructor(private apiService: ApiService,
    public authService: AuthService,
    private alertService: AlertService) { }

  ngOnInit() {
    this.subscriptionsUser.push(this.getListDeviceControl(this.authService.afAuth.auth.currentUser.uid));
    this.subscriptionsUser.push(this.getRule(this.authService.afAuth.auth.currentUser.uid));
    this.dropdownList = [
      { item_id: 2, item_text: 'Monday' },
      { item_id: 3, item_text: 'Tuesday' },
      { item_id: 4, item_text: 'Wednesday' },
      { item_id: 5, item_text: 'Thursday' },
      { item_id: 6, item_text: 'Friday' },
      { item_id: 7, item_text: 'Saturday' },
      { item_id: 8, item_text: 'Sunday' }
    ];
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };
  }

  onItemSelect(item: any) {
  }
  onSelectAll(items: any) {
  }

  onChangeHub(value) {
    this.deviceList = [];
    this.apiService.getListDeviceControl(this.authService.afAuth.auth.currentUser.uid).subscribe((data: GetDevices) => {
      this.listDevicesControl = data;
      for (let i = 0; i < this.listDevicesControl.devices.length; i++) {
        if (value === this.listDevicesControl.devices[i].id) {
          for (let j = 0; j < this.listDevicesControl.devices[i].devices.length; j++) {
            this.deviceList.push(this.listDevicesControl.devices[i].devices[j]);
          }
        }
      }
    });
  }

  onChangeDevice(value) {
    for (let i = 0; i < this.deviceList.length; i++) {
      if (this.deviceID == this.deviceList[i].id) {
        if (this.deviceList[i].type == 'Led') {
          this.statusArray = this.led;
        } else if (this.deviceList[i].type == 'SG90') {
          this.statusArray = this.servo;
        }
      }
    }
  }

  getListDeviceControl(user: string) {
    return this.apiService.getListDeviceControl(user).subscribe((data: GetDevices) => {
      this.listDevicesControl = data;
    });
  }

  onSubmit() {
    for (let i = 0; i < this.selectedItems.length; i++) {
      this.dayInWeekID.push(this.selectedItems[i].item_id);
    }
    let apiKey = this.hubID;
    let device = this.deviceID;
    let user = this.authService.afAuth.auth.currentUser.uid;
    let start = this.startTime;
    let end = this.endTime;
    let day = this.dayInWeekID.join(";");
    let status = this.status;
    this.addRule(apiKey, device, user, start, end, day, status);
    this.subscriptionsUser.push(this.getRule(this.authService.afAuth.auth.currentUser.uid));
    this.hubID = '';
    this.deviceID = '';
    this.startTime = '';
    this.endTime = '';
    this.selectedItems = [];
    this.dayInWeekID = [];
    this.status = '';
  }

  addRule(apiKey: string, device: string, user: string, start: string, end: string, day: string, status: string) {
    this.apiService.addRule(apiKey, device, user, start, end, day, status).subscribe((data: any) => {
      if (data.error == false) {
        this.alertService.success(data.message);
        this.subscriptionsUser.push(this.getRule(this.authService.afAuth.auth.currentUser.uid));
      } else if (data.error == true) {
        this.alertService.danger(data.message);
      }
    });
  }

  getRule(user: string) {
    return this.apiService.getRule(user).subscribe((data: Rule) => {
      this.rule = data;
      if (this.rule.error == false) {
      } else if (this.rule.error == true) {
      }
    });
  }

  removeRule(user: string, rule: string) {
    this.apiService.removeRule(user, rule).subscribe((data: any) => {
      if (data.error == false) {
        this.subscriptionsUser.push(this.getRule(this.authService.afAuth.auth.currentUser.uid));
        this.alertService.success(data.message);
      } else if (data.error == true) {
        this.alertService.danger(data.message);
      }
    })
  }

}
