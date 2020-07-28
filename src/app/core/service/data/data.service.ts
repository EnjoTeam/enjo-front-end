import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private subject = new Subject<any>();

  sendBedroomAPI(log: string) {
    this.subject.next({ apiKeyLog: log });
  }

  sendLivingroomAPI(log: string, control: string) {
    this.subject.next({ apiKeyLog: log, apiKeyControl: control });
  }

  sendGardenAPI(log: string) {
    this.subject.next({ apiKeyLog: log });
  }

  sendToiletAPI(log: string) {
    this.subject.next({ apiKeyLog: log });
  }

  clearMessage() {
    this.subject.next();
  }

  getMessage(): Observable<any> {
    return this.subject.asObservable();
  }
}
