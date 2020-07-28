import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../../service/auth/auth.service';
import { take, map, tap } from 'rxjs/operators';
import { User } from '../../object/user/user';
import { AlertService } from 'ngx-alerts';

@Injectable({
  providedIn: 'root'
})
export class SecureGuard implements CanActivate {

  constructor(private auth: AuthService, private router: Router, private alertService: AlertService) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    let items: User;
    let userData = localStorage.getItem('user');
    if (userData === null) {
      this.router.navigate(['/login']);
    }
    return this.auth.user$.pipe(
      take(1),
      map(user => !!user), // <-- map to boolean
      tap(loggedIn => {
        if (!loggedIn) {
          localStorage.removeItem('user');
          this.alertService.danger('Permission Denied!');
          this.router.navigate(['/login-provider']);
        } else {
          this.auth.afs
          .collection('users')
          .doc(`/${this.auth.afAuth.auth.currentUser.uid}`)
          .snapshotChanges()
          .subscribe(snapshots => {
            items = snapshots.payload.data();
            if (items.role !== "provider") {
              this.alertService.danger('Permission Denied!');
              this.router.navigate(['/login-provider']);
            }
          });
        }
      })
    )
  }
}
