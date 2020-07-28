import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { GetDevices, Devices } from '../../object/get-devices/get-devices';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private httpClient: HttpClient) { }

  /* -- HTTP Headers -- */
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    })
  }

  /* -- Error handling -- */
  handleError(error) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(errorMessage);
  }

  /* -- HttpClient API get() method => get Device Control -- */
  getDeviceControl(): Observable<GetDevices> {
    return this.httpClient.get<any>(`${environment.apiUrl}${environment.device.get.control}`)
      .pipe(retry(1), catchError(this.handleError));
  }

  /* -- HttpClient API get() method => get Device Log -- */
  getDeviceLog(): Observable<GetDevices> {
    return this.httpClient.get<any>(`${environment.apiUrl}${environment.device.get.log}`)
      .pipe(retry(1), catchError(this.handleError));
  }

  /* -- HttpClient API get() method => register User Device Control -- */
  registerUserDeviceControl(apiKey: string, password: string, user: string, image: string, mail: string): Observable<any> {
    const body = new HttpParams()
      .set('62ac0b425c235d5ff1d42445f5f', password)
      .set('e155162deb41f57a66855c021d2b57f', user)
      .set('image', image)
      .set('mail', mail);
    return this.httpClient.post<any>(`${environment.apiUrl}${environment.user.register.control}${apiKey}`,
      body.toString(), this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }

  /* -- HttpClient API get() method => register User Device Log -- */
  registerUserDeviceLog(apiKey: string, password: string, user: string): Observable<any> {
    return this.httpClient.get<any>(`${environment.apiUrl}${environment.user.register.log}${apiKey}/${password}/${user}`)
      .pipe(retry(1), catchError(this.handleError));
  }

  /* -- HttpClient API get() method => get Recent Log -- */
  getRecentLog(apiKey: string, user: string): Observable<any> {
    return this.httpClient.get<any>(`${environment.apiUrl}${environment.log.get.recent}${apiKey}/${user}`)
      .pipe(retry(1), catchError(this.handleError));
  }

  /* -- HttpClient API get() method => get All Log -- */
  getAllLog(apiKey: string, user: string): Observable<any> {
    return this.httpClient.get<any>(`${environment.apiUrl}${environment.log.get.all}${apiKey}/${user}`)
      .pipe(retry(1), catchError(this.handleError));
  }

  /* -- HttpClient API get() method => get Control -- */
  getControl(apiKey: string, user: string, field: string, device: string): Observable<any> {
    return this.httpClient.get<any>(`${environment.apiUrl}${environment.control.get}${apiKey}/${device}/${user}/${field}`)
      .pipe(retry(1), catchError(this.handleError));
  }

  /* -- HttpClient API post() method => get Control -- */
  updateControl(apiKey: string, user: string, device: string, status: string, action: string, name: string, type: string, email: string): Observable<any> {
    const body = new HttpParams()
      .set('status', status)
      .set('username', email)
      .set('action', action)
      .set('nameDevice', name)
      .set('type', type);
    return this.httpClient.post(`${environment.apiUrl}${environment.control.update}${apiKey}/${device}/${user}`,
      body.toString(), this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }

  /* -- HttpClient API get() method => get List Device Control -- */
  getListDeviceControl(user: string): Observable<GetDevices> {
    return this.httpClient.get<any>(`${environment.apiUrl}${environment.user.list.control}${user}`)
      .pipe(retry(1), catchError(this.handleError));
  }

  /* -- HttpClient API get() method => get List Device Log -- */
  getListDeviceLog(user: string): Observable<GetDevices> {
    return this.httpClient.get<any>(`${environment.apiUrl}${environment.user.list.log}${user}`)
      .pipe(retry(1), catchError(this.handleError));
  }

  /* -- HttpClient API get() method => get List Device Log -- */
  removeUserDeviceControl(apiKey: string, user: string) {
    return this.httpClient.get<any>(`${environment.apiUrl}${environment.user.remove.control}${apiKey}/${user}`)
      .pipe(retry(1), catchError(this.handleError));
  }

  /* -- HttpClient API post() method => edit List Device -- */
  editUserDeviceControl(apiKey: string, user: string, image: string) {
    const body = new HttpParams()
      .set('hubID', apiKey)
      .set('user', user)
      .set('image', image);
    return this.httpClient.post(`${environment.apiUrl}${environment.user.edit.control}`,
      body.toString(), this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));

  }

  /* -- HttpClient API get() method => get History Device -- */
  getUserHistoryControl(apiKey: string, device: string, user: string) {
    return this.httpClient.get<any>(`${environment.apiUrl}${environment.user.history.control}/${apiKey}/${device}/${user}`)
      .pipe(retry(1), catchError(this.handleError));
  }

  /* -- HttpClient API post() method => get List Device Log -- */
  addRule(apiKey: string, device: string, user: string, start: string, end: string, day: string, status: string) {
    const body = new HttpParams()
      .set('hubID', apiKey)
      .set('deviceID', device)
      .set('user', user)
      .set('start_time', start)
      .set('end_time', end)
      .set('day_in_week', day)
      .set('expectation_status', status);
    return this.httpClient.post(`${environment.apiUrl}${environment.rule.add}`,
      body.toString(), this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }

  /* -- HttpClient API post() method => get Library -- */
  registerLibrary(displayName: string, company: string, location: string, type: string, number: string) {
    const body = new HttpParams()
      .set('fullname', displayName)
      .set('company', company)
      .set('location', location)
      .set('type_hubs', type)
      .set('number_hubs', number);
    return this.httpClient.post(`${environment.apiUrl}${environment.library.register}`,
      body.toString(), this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }

  /* -- HttpClient API post() method => get Info Device -- */
  getInfoDevice(type: string) {
    const body = new HttpParams()
      .set('type', type);
    return this.httpClient.post(`${environment.apiUrl}${environment.library.device}`,
      body.toString(), this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }

  /* -- HttpClient API post() method => get Token -- */
  getToken(provider: string) {
    const body = new HttpParams()
      .set('provider_name', provider);
    return this.httpClient.post(`${environment.apiUrl}${environment.library.token}`,
      body.toString(), this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }

  /* -- HttpClient API post() method => get Rule -- */
  getRule(user: string) {
    const body = new HttpParams()
      .set('user', user);
    return this.httpClient.post(`${environment.apiUrl}${environment.rule.get}`,
      body.toString(), this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }

  /* -- HttpClient API post() method => get Token -- */
  removeRule(user: string, rule: string) {
    const body = new HttpParams()
      .set('user', user)
      .set('rule_id', rule);
    return this.httpClient.post(`${environment.apiUrl}${environment.rule.remove}`,
      body.toString(), this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }
}
