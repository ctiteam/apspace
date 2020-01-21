import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { WsApiService } from './ws-api.service';

@Injectable({
  providedIn: 'root'
})
export class WebspacePasswordService {
  url = 'https://api.apiit.edu.my/webspace-id';

  constructor(private ws: WsApiService) { }

  changePassword(newPassword): Observable<any> {
    return this.ws.post<any>(`/change`, { body: newPassword, url: this.url });
  }

  resetPassword(requestReset): Observable<any> {
    return this.ws.post<any>(`/reset`, { body: requestReset, url: this.url });
  }
}
