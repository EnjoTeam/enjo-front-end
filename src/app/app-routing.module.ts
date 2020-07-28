import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

/* -- Guard -- */
import { AuthGuard } from './core/guard/auth/auth.guard';
import { SecureGuard } from './core/guard/secure/secure.guard';

/* -- Component -- */
import { LandingComponent } from './component/landing/landing.component';
import { LoginComponent } from './component/authentication/login/login.component';
import { RegisterComponent } from './component/authentication/register/register.component';
import { ForgotPasswordComponent } from './component/authentication/forgot-password/forgot-password.component';
import { VerifyEmailComponent } from './component/authentication/verify-email/verify-email.component';
import { DashboardComponent } from './component/dashboard/dashboard/dashboard.component';
import { LogComponent } from './component/dashboard/log/log.component';
import { MonitorComponent } from './component/dashboard/monitor/monitor.component';
import { DeviceComponent } from './component/dashboard/device/device.component';
import { ProfileComponent } from './component/dashboard/profile/profile.component';
import { HistoryComponent } from './component/dashboard/history/history.component';
import { ChartComponent } from './component/dashboard/chart/chart.component';
import { RuleComponent } from './component/dashboard/rule/rule.component';
import { LoginProviderComponent } from './component/authentication/login-provider/login-provider.component';
import { RegisterProviderComponent } from './component/authentication/register-provider/register-provider.component';
import { ProviderComponent } from './component/provider/provider/provider.component';
import { LibraryComponent } from './component/provider/library/library.component';
import { ComingSoonComponent } from './component/coming-soon/coming-soon.component';
import { TokenComponent } from './component/provider/token/token.component';
import { InfoComponent } from './component/provider/info/info.component';

const routes: Routes = [
  { path: '', redirectTo: '/landing', pathMatch: 'full' },
  { path: 'landing', component: LandingComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'verify-email', component: VerifyEmailComponent },
  { path: 'coming-soon', component: ComingSoonComponent },
  {//
    path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard], children: [
      {
        path: 'logging', component: LogComponent
      },
      {
        path: 'monitoring', component: MonitorComponent
      },
      {
        path: 'device', component: DeviceComponent
      },
      {
        path: 'profile', component: ProfileComponent
      },
      {
        path: 'history', component: HistoryComponent
      },
      {
        path: 'chart', component: ChartComponent
      },
      {
        path: 'rule', component: RuleComponent
      }
    ]
  },
  { path: 'login-provider', component: LoginProviderComponent },
  { path: 'register-provider', component: RegisterProviderComponent },
  {
    path: 'provider', component: ProviderComponent, canActivate: [SecureGuard], children: [
      {
        path: 'library', component: LibraryComponent
      },
      {
        path: 'token', component: TokenComponent
      },
      {
        path: 'info', component: InfoComponent
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
