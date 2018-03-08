import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

import { Observable } from 'rxjs/Observable';
import { catchError } from 'rxjs/operators';

@Injectable()
export class CasTicketProvider {

  casUrl = 'https://cas1.apiit.edu.my';

  constructor(public http: HttpClient, public storage: Storage) { }

  /** POST: request ticket-granting ticket from CAS */
  getTGT(username: string, password: string): Observable<string> {
    const data = `username=${username}&password=${password}`;
    const options = {
      headers: { 'Content-type': 'application/x-www-form-urlencoded' },
      observe: 'response' as 'body'
    };
    return this.http.post(this.casUrl + '/cas/v1/tickets', data, options)
    .catch(res => Observable.of(res.headers.get('Location').split('/').pop()));
  }

  /** POST: request service ticket from CAS */

  getST(serviceUrl: string, tgt: string): Observable<string> {
    const options = {
      headers: { 'Content-type': 'application/x-www-form-urlencoded' },
      params: { 'service': serviceUrl },
      responseType: 'text' as 'text', /* TODO: fix this in future angular */
      withCredentials: true
    };
    const url = `${this.casUrl}/cas/v1/tickets/${tgt}`;
    return this.http.post(url, null, options).pipe(
      // tap(() => console.log(`getST ${serviceUrl}`)),
      catchError(this.handleError<string>('getServiceTicket', ''))
    );
  }

  /** POST: request service ticket from CAS (deprecated) */
  getSTOld(serviceUrl: string): Observable<string> {
    const options = {
      headers: { 'Content-type': 'application/x-www-form-urlencoded' },
      params: { 'service': serviceUrl },
      responseType: 'text' as 'text', /* TODO: fix this in future angular */
      withCredentials: true
    };
    return Observable.fromPromise(this.storage.get('tgturl')).first()
    .switchMap(url => this.http.post(url, null, options).pipe(
      // tap(() => console.log(`getST ${serviceUrl}`)),
      catchError(this.handleError<string>('getServiceTicket', ''))
    ));
  }

  /** GET: validate service ticket */
  validateST(serviceUrl: string, st: string): Observable<string> {
    const options = {
      responseType: 'text' as 'text'
    };
    const url = `${this.casUrl}/cas/p3/serviceValidate?service=${serviceUrl}&ticket=${st}`;
    return this.http.get(url, options);
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(operation, error);

      // Let the app keep running by returning an empty result.
      return Observable.of(result as T);
    };
  }

}
