import { HttpClient } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Device } from '@ionic-native/device';
import { NetworkInterface } from '@ionic-native/network-interface';
import { Observable } from 'rxjs/Observable';
import { switchMap } from 'rxjs/operators';
import { fromPromise } from 'rxjs/observable/fromPromise'

import { CasTicketProvider } from '../providers';

@Injectable()
export class DataCollectorProvider {

  DATACOLLECTOR_URL = "https://4tkasy3xf6.execute-api.ap-southeast-1.amazonaws.com/api";
  SERVICE_URL = "http://ws.apiit.edu.my";
  public results = {};

  public cas: CasTicketProvider;

  constructor(
    public http: HttpClient,
    private device: Device,
    private injector: Injector,
    private networkInterface: NetworkInterface,
  ) { }

  /**
   * POST: Send device info
   *
   */
  sendDeviceInfo(): Observable<any> {
    let ip: any;
    this.cas = this.injector.get(CasTicketProvider);
    return fromPromise(this.networkInterface.getWiFiIPAddress()).pipe(
      switchMap(responseIP => {
        ip = responseIP.ip;
        return this.cas.getST(this.SERVICE_URL);
      }),
      switchMap(st => {
        let body: any = {
          'service_ticket': st,
          'uuid': this.device.uuid,
          'model': this.device.model,
          'os': this.device.version,
          'wifi': 'testing',
          'ip': ip,
          'is_virtual': this.device.isVirtual
        };
        const options = {
          headers: { 'Content-type': 'application/json' }
        }
        let enpoint = `${this.DATACOLLECTOR_URL}/login`;
        return this.http.post(enpoint, body, options);
      })
    )
  }

  /**
   * POST: Send service_ticket and uuid on log out
   *
   */
  sendOnLogout(): Observable<any> {
    this.cas = this.injector.get(CasTicketProvider);
    return this.cas.getST(this.SERVICE_URL).pipe(
      switchMap(st => {
        let body: any = {
          'service_ticket': st,
          'uuid': this.device.uuid,
        };
        console.log(body)
        const options = {
          headers: { 'Content-type': 'application/json' }
        }
        let endpoint = `${this.DATACOLLECTOR_URL}/logout`;
        return this.http.post(endpoint, body, options);
      })
    )
  }
}
