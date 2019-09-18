import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { WsApiService } from './ws-api.service';

const getOptions = {
  headers: new HttpHeaders({
    'X-Require-Service-Ticket': ''
  })
};

@Injectable({
  providedIn: 'root'
})
export class ChangePasswordService {
  url = 'https://rk0bjjav54.execute-api.ap-southeast-1.amazonaws.com/dev';
  constructor(private httpClient: HttpClient, private wsApiService: WsApiService) { }

  getUser() {
    return this.wsApiService.get(`/user`, true, {
      url: this.url
    });
  }

  changePassword(newPassword): Observable<any> {
    return this.wsApiService.post<any>(`/user`, { body: newPassword, url: this.url});
      // .pipe(
      //   catchError(e => {
      //     // this.showAlert(e.message);
      //     throw new Error(e);
      //   })
      // );
  }
}
