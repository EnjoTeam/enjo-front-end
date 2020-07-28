import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/service/auth/auth.service';
import { HttpClient } from '@angular/common/http';
import { first } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-provider',
  templateUrl: './provider.component.html',
  styleUrls: ['./provider.component.css']
})
export class ProviderComponent implements OnInit {

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
