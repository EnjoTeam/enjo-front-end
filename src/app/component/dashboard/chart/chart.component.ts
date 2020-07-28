import { Component, OnInit, NgZone, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ApiService } from 'src/app/core/service/api/api.service';
import { AuthService } from 'src/app/core/service/auth/auth.service';
import { Router } from '@angular/router';
import { GetDevices } from 'src/app/core/object/get-devices/get-devices';
import { Table } from 'src/app/core/object/table/table';
import { TableRpi } from 'src/app/core/object/table-rpi/table-rpi';
import * as moment from 'moment';
import { ChartDataSets } from 'chart.js';
import { Label, Color } from 'ng2-charts';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnInit, OnDestroy {

  private subscriptionsUser: Subscription[] = [];

  listDevicesControl: GetDevices;
  recordBedRoom: Table[] = [];
  recordLivingRoom: Table[] = [];
  recordGarden: Table[] = [];
  recordToilet: TableRpi[] = [];

  type = 'LineChart';
  titleBedRoom = '';
  titleLivingRoom = '';
  titleGarden = '';
  titleToilet = '';
  dataBedRoom = [];
  dataLivingRoom = [];
  dataGarden = [];
  dataToilet = [];
  time: any;
  columnNamesESP = ['Time', 'heap'];
  columnNamesRPI = ['Time', 'ram'];
  options = {
    hAxis: {
      title: 'Time'
    },
    vAxis: {
      title: 'Memory'
    },
  };

  width = 900;
  height = 400;

  /* -- Line Chart -- */
  public lineChartType = 'line';
  public lineChartPlugins = [];
  public datasetsBedRoom: ChartDataSets[] = [];
  public datasetsLivingRoom: ChartDataSets[] = [];
  public datasetsGarden: ChartDataSets[] = [];
  public datasetsToilet: ChartDataSets[] = [];
  public labelsBedRoom: Label[] = [];
  public labelsLivingRoom: Label[] = [];
  public labelsGarden: Label[] = [];
  public labelsToilet: Label[] = [];
  public lineChartColors:  Color[] = [
    {
      backgroundColor: 'rgba(105, 0, 132, .2)',
      borderColor: 'rgba(200, 99, 132, .7)',
      borderWidth: 2,
    },
  ];
  public lineChartLegend = true;
  public lineChartOptions: any = {
    responsive: true
  };

  /* -- Gauge Chart -- */
  public canvasWidth = 300
  public cpu = 0;
  public rpiCPULabel = '';
  public temp = 0;
  public rpiTempLabel = '';
  public rpiCentralLabel = '';
  public rpiCPUBottomLabel = '';
  public rpiTempBottomLabel = '';
  public optionsCPU = {
    hasNeedle: true,
    needleColor: 'gray',
    needleUpdateSpeed: 1000,
    arcColors: ['rgb(44, 151, 222)', 'lightgray'],
    arcDelimiters: [30],
    rangeLabel: ['0', '100'],
    needleStartValue: 50,
  }

  public optionsTemp = {
    hasNeedle: true,
    needleColor: 'gray',
    needleUpdateSpeed: 1000,
    arcColors: ['rgb(44, 151, 222)', 'lightgray'],
    arcDelimiters: [30],
    rangeLabel: ['0', '100'],
    needleStartValue: 50,
  }

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
        this.subscriptionsUser.push(this.getRecentLog(this.listDevicesControl.devices[i].id, user));
      }
    });
  }

  getRecentLog(apikey: string, user: string) {
    return this.apiService.getRecentLog(apikey, user).subscribe((data: any) => {
      if (data.log[0].name.match('Bed Room')) {
        this.recordBedRoom = data.log;
        for (let i = 0; i < this.recordBedRoom.length; i++) {
          this.dataBedRoom.push(Number(this.recordBedRoom[i].freeHeapSize));
          this.labelsBedRoom.push(moment.unix(Number(this.recordBedRoom[i].timestamp)).format("HH:mm:ss"));
        }
        this.datasetsBedRoom.push({data: this.dataBedRoom, label: data.log[0].name});
      } else if (data.log[0].name.match('Living Room')) {
        this.recordLivingRoom = data.log;
        for (let i = 0; i < this.recordLivingRoom.length; i++) {
          this.dataLivingRoom.push(Number(this.recordLivingRoom[i].freeHeapSize));
          this.labelsLivingRoom.push(moment.unix(Number(this.recordLivingRoom[i].timestamp)).format("HH:mm:ss"));
        }
        this.datasetsLivingRoom.push({data: this.dataLivingRoom, label: data.log[0].name});
      } else if (data.log[0].name.match('Garden')) {
        this.recordGarden = data.log;
        for (let i = 0; i < this.recordGarden.length; i++) {
          this.dataGarden.push(Number(this.recordGarden[i].freeHeapSize));
          this.labelsGarden.push(moment.unix(Number(this.recordGarden[i].timestamp)).format("HH:mm:ss"));
        }
        this.datasetsGarden.push({data: this.dataGarden, label: data.log[0].name});
      } else if (data.log[0].name.match('Toilet')) {
        this.recordToilet = data.log;
        for (let i = 0; i < this.recordToilet.length; i++) {
          if (i == 0) {
            this.cpu = this.recordToilet[i].deviceCpuUsed;
            this.rpiCPULabel = 'CPU Used';
            this.temp = this.recordToilet[i].deviceTemp;
            this.rpiTempLabel = 'Temperature';
            this.rpiCPUBottomLabel = String(this.recordToilet[i].deviceCpuUsed) + '%';
            this.rpiTempBottomLabel = String(this.recordToilet[i].deviceTemp) + '°C';
            this.time = this.recordToilet[i].timestamp;
          }
          this.dataToilet.push(Number(this.recordToilet[i].deviceRAMInfo));
          this.labelsToilet.push(moment.unix(Number(this.recordToilet[i].timestamp)).format("HH:mm:ss"));
        }
        this.datasetsToilet.push({data: this.dataToilet, label: data.log[0].name});
      }
    });
  }
}
