import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApiService } from 'src/app/core/service/api/api.service';
import { AuthService } from 'src/app/core/service/auth/auth.service';
import { AlertService } from 'ngx-alerts';
import { Subscription } from 'rxjs';
import { User } from 'src/app/core/object/user/user';
import { Token } from 'src/app/core/object/token/token';
import * as moment from 'moment';

@Component({
  selector: 'app-token',
  templateUrl: './token.component.html',
  styleUrls: ['./token.component.css']
})
export class TokenComponent implements OnInit, OnDestroy {

  private subscriptionsUser: Subscription[] = [];

  recordToken: Token[] = [];
  token: Token;
  term: any;

  settings = {
    columns: {
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
      mac: {
        title: 'Number Hubs',
        valuePrepareFunction: (cell, row) => {
          let count = 0;
          for (let i = 0; i < row.mac.length; i++) {
            count++;
          }
          return String(count + ' Devices');
        },
        filterFunction: (cell?: any, search?: string) => {
          let count = 0;
          for (let i = 0; i < cell.length; i++) {
            count++;
          }
          if (search.length > 0) {
            return String(count + ' Devices').match(search);
          }
        },
      },
      remain_hubs: {
        title: 'Remain Hubs'
      },
      token: {
        title: 'Token',
        valuePrepareFunction: (cell, row) => {
          if (row.token.length > 20)
            return (row.token.substring(0, 20) + '...').replace(/./g, '*');
        },
      },
      type_hubs: {
        title: 'Type Hubs'
      },
    },
    hideSubHeader: false, // hide filter row
    // actions: {
    //   custom: [
    //     {
    //       name: 'info',
    //       title: '<div class="text-center"><i class="fas fa-info-circle fa-lg"></i></div>'
    //     },
    //   ],
    //   add: false,
    //   edit: false,
    //   delete: false
    // }
  }

  clickModal(event) {
  }

  constructor(
    private authService: AuthService,
    private apiService: ApiService,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    let items: User;
    this.authService.afs
      .collection('users')
      .doc(`/${this.authService.afAuth.auth.currentUser.uid}`)
      .snapshotChanges()
      .subscribe(snapshots => {
        items = snapshots.payload.data();
        this.subscriptionsUser.push(this.getToken(items.displayName));
      });
  }

  ngOnDestroy() {
    this.subscriptionsUser.forEach(subscriptionUser => subscriptionUser.unsubscribe());
  }

  getToken(provider: string) {
    return this.apiService.getToken(provider).subscribe((data: any) => {
      this.recordToken = data.tokens;
    })
  }

  getValue(value) {
    this.token = value;
  }
}
