import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

import { Observable } from 'rxjs/Observable';
import { catchError } from 'rxjs/operators';

@Injectable()
export class CasTicketProvider {

  constructor(public http: HttpClient, public storage: Storage) { }

  /** POST: retrieve service ticket from CAS */
  getTicket(serviceUrl: string): Observable<string> {
    const options = {
      headers: { 'Content-type': 'application/x-www-form-urlencoded' },
      params: { 'service': new URL(serviceUrl).origin },
      responseType: 'text' as 'text', /* TODO: fix this in future angular */
      withCredentials: true
    };
    return Observable.fromPromise(this.storage.get('tgturl')).switchMap(url =>
      this.http.post(url, null, options).pipe(
        // tap(() => console.log(`getTicket ${options.params.service}`)),
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
