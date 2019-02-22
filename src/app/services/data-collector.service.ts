import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Device } from '@ionic-native/device/ngx';

import { Observable } from 'rxjs';

import { WsApiService } from './ws-api.service';

@Injectable({
  providedIn: 'root'
})
export class DataCollectorService {

  constructor(
    public http: HttpClient,
    public device: Device,
    private ws: WsApiService,
  ) { }

  /**
   * POST: Send device info for login.
   */
  login(): Observable<any> {
    return this.ws.post<any>('/dc/login', {
      body: {
        is_virtual: this.device.isVirtual,
        model: this.device.model,
        os: this.device.version,
        uuid: this.device.uuid,
        wifi: 't',
      },
    });
  }

  /**
   * POST: Send device uuid on logout.
   */
  logout(): Observable<any> {
    return this.ws.post<any>('/dc/logout', {
      body: {
        uuid: this.device.uuid,
      },
    });
  }
}
