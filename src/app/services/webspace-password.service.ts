import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { CasTicketService } from './cas-ticket.service';

@Injectable({
  providedIn: 'root'
})
export class WebspacePasswordService {

  url = 'https://api.apiit.edu.my/webspace-id';

  constructor(private http: HttpClient, private cas: CasTicketService) { }

  changePassword(body: { current: string, new: string }): Observable<any> {
    const formBody = new HttpParams().set('new', body.new).set('current', body.current);

    return this.cas.getST(`${this.url}/change`).pipe(
      switchMap(ticket => {
        return this.http.post(
          `${this.url}/change?ticket=${ticket}`,
          formBody.toString(),
          { headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded') }
        );
      })
    );
  }

  resetPassword(passportNumber: string): Observable<any> {
    const formBody = new HttpParams().set('passport', passportNumber);

    return this.cas.getST(`${this.url}/change`).pipe(
      switchMap(ticket => {
        return this.http.post(
          `${this.url}/change?ticket=${ticket}`,
          formBody.toString(),
          { headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded') }
        );
      })
    );
  }
}
