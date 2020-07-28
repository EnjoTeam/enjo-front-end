import { Component, OnInit, NgZone, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/core/service/auth/auth.service';
import { Router } from '@angular/router';
import { HttpClient } from "@angular/common/http";
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {

  private subscriptionsUser: Subscription[] = [];

  constructor(public authService: AuthService,
    public router: Router,
    public ngZone: NgZone,
    private httpClient: HttpClient) { }

  ngOnInit() {
    this.subscriptionsUser.push(this.checkConnect());
  }

  ngOnDestroy() {
    this.subscriptionsUser.forEach(subscriptionUser => subscriptionUser.unsubscribe());
  }

  checkConnect() {
    return this.httpClient.get('https://enjo-iot.xyz/', { observe: 'response' })
      .pipe(first())
      .subscribe(resp => {
        if (resp.status === 0) {
          this.authService.signOut();
          this.router.navigate(['/coming-soon']);
        }
      }, err => {
        if (err.status === 0) {
          this.authService.signOut();
          this.router.navigate(['/coming-soon']);
        }
      });
  }
}
