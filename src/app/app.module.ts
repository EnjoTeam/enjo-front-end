import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

/* -- Core Component -- */
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
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
/* -- Core Component -- */

/* -- Shared Component -- */
/* -- Shared Component -- */

/* -- Third Party Module -- */
import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';
import { SelectDropDownModule } from 'ngx-select-dropdown';
import { NgxInputSwitchModule } from '@ngx-lite/input-switch';
import { LoadingBarHttpClientModule } from '@ngx-loading-bar/http-client';
import { LoadingBarRouterModule } from '@ngx-loading-bar/router';
import { LoadingBarModule } from '@ngx-loading-bar/core';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { OrderModule } from 'ngx-order-pipe';
import { AlertModule } from 'ngx-alerts';
import { ImageUploadModule } from 'ng2-imageupload';
import { GoogleChartsModule } from 'angular-google-charts';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { TimeagoModule } from 'ngx-timeago';
import { GaugeChartModule } from 'angular-gauge-chart'
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { ChartsModule } from 'ng2-charts';
/* -- Third Party Module -- */

/* -- Firebase services + enviorment module -- */
import { AngularFireModule } from "@angular/fire";
import { AngularFireAuthModule } from "@angular/fire/auth";
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { environment } from '../environments/environment';
/* -- Firebase services + enviorment module -- */

/* -- Core Module -- */
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
/* -- Core Module -- */

/* -- Core Service -- */
import { AuthService } from './core/service/auth/auth.service';
import { AuthGuard } from './core/guard/auth/auth.guard';
import { SecureGuard } from './core/guard/secure/secure.guard';
/* -- Core Service -- */

@NgModule({
  declarations: [
    AppComponent,
    LandingComponent,
    LoginComponent,
    RegisterComponent,
    ForgotPasswordComponent,
    VerifyEmailComponent,
    DashboardComponent,
    LogComponent,
    MonitorComponent,
    DeviceComponent,
    ProfileComponent,
    HistoryComponent,
    ChartComponent,
    RuleComponent,
    LoginProviderComponent,
    RegisterProviderComponent,
    ProviderComponent,
    LibraryComponent,
    ComingSoonComponent,
    TokenComponent,
    InfoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    ScrollToModule.forRoot(),
    SelectDropDownModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,
    NgxInputSwitchModule,
    LoadingBarHttpClientModule,
    LoadingBarRouterModule,
    LoadingBarModule,
    Ng2SmartTableModule,
    OrderModule,
    AlertModule.forRoot({ maxMessages: 5, timeout: 5000, position: 'right' }),
    ImageUploadModule,
    GoogleChartsModule,
    NgxMaterialTimepickerModule,
    NgMultiSelectDropDownModule.forRoot(),
    TimeagoModule.forRoot(),
    GaugeChartModule,
    Ng2SearchPipeModule,
    ChartsModule
  ],
  providers: [AuthService, AuthGuard, SecureGuard, DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
