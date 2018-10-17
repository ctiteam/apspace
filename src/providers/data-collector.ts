import { HttpClient } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Device } from '@ionic-native/device';
import { Observable } from 'rxjs/Observable';
import { switchMap } from 'rxjs/operators';

import { CasTicketProvider } from '../providers';

@Injectable()
export class DataCollectorProvider {

  DATACOLLECTOR_URL = 'https://3mv92hk9xe.execute-api.ap-southeast-1.amazonaws.com/api';
  SERVICE_URL = 'http://ws.apiit.edu.my';
  results = {};

  cas: CasTicketProvider;

  constructor(
    public http: HttpClient,
    private device: Device,
    private injector: Injector,
  ) { }

  /**
   * POST: Send device info
   *
   */
  sendDeviceInfo(): Observable<any> {
    let ip: string;
    this.cas = this.injector.get(CasTicketProvider);
    return this.http.get('https://api.ipify.org?format=json').pipe(
      switchMap(responseIP => {
        ip = responseIP['ip'];
        return this.cas.getST(this.SERVICE_URL);
      }),
      switchMap(st => {
        const body: any = {
          ip,
          is_virtual: this.device.isVirtual,
          model: this.device.model,
          os: this.device.version,
          service_ticket: st,
          uuid: this.device.uuid,
          wifi: 't',
        };
        const options = {
          headers: { 'Content-type': 'application/json' },
        };
        const enpoint = `${this.DATACOLLECTOR_URL}/login`;
        return this.http.post(enpoint, body, options);
      }),
    );
  }

  /**
   * POST: Send service_ticket and uuid on log out
   *
   */
  sendOnLogout(): Observable<any> {
    this.cas = this.injector.get(CasTicketProvider);
    return this.cas.getST(this.SERVICE_URL).pipe(
      switchMap(st => {
        const body: any = {
          service_ticket: st,
          uuid: this.device.uuid,
        };
        const options = {
          headers: { 'Content-type': 'application/json' },
        };
        const endpoint = `${this.DATACOLLECTOR_URL}/logout`;
        return this.http.post(endpoint, body, options);
      }),
    );
  }
}
