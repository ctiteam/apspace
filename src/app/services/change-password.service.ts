import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { WsApiService } from './ws-api.service';

@Injectable({
  providedIn: 'root'
})
export class ChangePasswordService {
  url = 'https://rk0bjjav54.execute-api.ap-southeast-1.amazonaws.com/dev';
  constructor(private wsApiService: WsApiService) { }

  getUser() {
    return this.wsApiService.get(`/user`, true, {
      url: this.url
    });
  }

  changePassword(newPassword): Observable<any> {
    return this.wsApiService.post<any>(`/user`, { body: newPassword, url: this.url });
  }

  getStudent() {
    return this.wsApiService.get(`/student`, true, {
      url: this.url
    });
  }

  changePasswordStudent(newPassword): Observable<any> {
    return this.wsApiService.post<any>(`/student`, { body: newPassword, url: this.url });
  }
}
