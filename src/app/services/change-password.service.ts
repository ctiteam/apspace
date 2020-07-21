import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { WsApiService } from './ws-api.service';

@Injectable({
  providedIn: 'root'
})
export class ChangePasswordService {
  url = 'https://rk0bjjav54.execute-api.ap-southeast-1.amazonaws.com/dev';
  constructor(private ws: WsApiService) { }

  getUser() {
    return this.ws.get(`/user`, {
      url: this.url
    });
  }

  changePassword(newPassword): Observable<any> {
    return this.ws.post<any>(`/user`, { body: newPassword, url: this.url });
  }

  getStudent() {
    return this.ws.get(`/student`, {
      url: this.url
    });
  }

  changePasswordStudent(newPassword): Observable<any> {
    return this.ws.post<any>(`/student`, { body: newPassword, url: this.url });
  }

}
