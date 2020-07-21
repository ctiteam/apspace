import { Injectable } from '@angular/core';
import { Device } from '@ionic-native/device/ngx';
import { Observable } from 'rxjs';

import { VersionService } from './version.service';
import { WsApiService } from './ws-api.service';

@Injectable({
  providedIn: 'root'
})
export class DataCollectorService {

  constructor(
    public device: Device,
    private ws: WsApiService,
    private version: VersionService
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
        app_version: this.version.name,
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
