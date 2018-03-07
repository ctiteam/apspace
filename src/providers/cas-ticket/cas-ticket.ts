import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

import { Observable } from 'rxjs/Observable';
import { catchError } from 'rxjs/operators';

@Injectable()
export class CasTicketProvider {

  private casUrl = 'https://cas1.apiit.edu.my/cas/v1/tickets';

  constructor(public http: HttpClient, public storage: Storage) { }

  /** POST: request ticket-granting ticket from CAS */
  getTGT(username: string, password: string): Observable<string> {
    const data = `username=${username}&password=${password}`;
    const options = {
      headers: { 'Content-type': 'application/x-www-form-urlencoded' },
      observe: 'response' as 'body'
    };
    return this.http.post(this.casUrl, data, options)
    .catch(res => Observable.of(res.headers.get('Location').split('/').pop()));
  }

  /** POST: request service ticket from CAS */
  getST(serviceUrl: string): Observable<string> {
    const options = {
      headers: { 'Content-type': 'application/x-www-form-urlencoded' },
      params: { 'service': serviceUrl },
      responseType: 'text' as 'text', /* TODO: fix this in future angular */
      withCredentials: true
    };
    return Observable.fromPromise(this.storage.get('tgturl')).first()
    .switchMap(url =>
      this.http.post(url, null, options).pipe(
        // tap(() => console.log(`getST ${serviceUrl}`)),
        catchError(this.handleError<string>('getServiceTicket', ''))
      )
    );
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
