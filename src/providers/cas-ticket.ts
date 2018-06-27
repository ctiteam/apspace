import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Events, Platform } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { SecureStorage } from '@ionic-native/secure-storage';
import { Observable } from 'rxjs/Observable';

import { empty } from 'rxjs/observable/empty';
import { of } from 'rxjs/observable/of';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { _throw as obs_throw } from 'rxjs/observable/throw';
import { catchError, switchMap, tap } from 'rxjs/operators';

/**
 * CAS Authentication with fallback mechanism.
 *
 *               Authenticate        (request on failure/after login)
 * +-------------+ -------> +--------+  - - - > +-------+  - - - > +---------+
 * | user:logout |          | getTGT |          | getST |          | Service |
 * +-------------+ <-x----- +--------+ <------- +-------+ <------- +---------+
 *         Invalid Credentials      Service Ticket       PHP Session
 *          (Observable.empty)         Expired             Expired
 */
@Injectable()
export class CasTicketProvider {

  casUrl = 'https://cas.apiit.edu.my';
  storage: any;

  validationResponse: any;

  constructor(
    public http: HttpClient,
    public baseStorage: Storage,
    public plt: Platform,
    public secureStorage: SecureStorage,
    public events: Events,
  ) {
    if (this.plt.is('cordova')) {
      this.secureStorage.create('ticket')
        .then(storage => this.storage = storage);
    } else {
      this.storage = this.baseStorage;
    }
  }

  /**
   * POST: request ticket-granting ticket from CAS and cache tgt and credentials
   * If username and password are not provided, use `cred` from storage and
   * logout and return empty() instead of throwing an error on failure.
   * @param username - username for CAS
   * @param password - password for CAS
   */
  getTGT(username?: string, password?: string): Observable<string> {
    const options = {
      headers: { 'Content-type': 'application/x-www-form-urlencoded' },
      observe: 'response' as 'body'
    };
    return (username && password
      ? of(`username=${username}&password=${password}`)
      : fromPromise(this.storage.get('cred'))
    ).pipe(
      switchMap(data => this.http.post(this.casUrl + '/cas/v1/tickets', data, options).pipe(
        catchError(res => res.status === 201 && res.headers.get('Location')
          ? of(res.headers.get('Location').split('/').pop())
          : username && password
            ? obs_throw('Invalid credentials')
            : (this.events.publish('user:logout'), empty())),
        tap(tgt => this.storage.set('tgt', tgt)),
        tap(_ => this.storage.set('cred', data)),
      ))
    );
  }

  /**
   * POST: request service ticket from CAS
   * Use `tgt` from storage if not provided.
   * @param serviceUrl - service url for CAS authentication
   * @param tgt - ticket granting ticket (default: cached `tgt`)
   */
  getST(serviceUrl: string = this.casUrl, tgt?: string | {}): Observable<string> {
    const options = {
      headers: { 'Content-type': 'application/x-www-form-urlencoded' },
      params: { 'service': serviceUrl },
      responseType: 'text' as 'text', /* TODO: fix this in future angular */
      withCredentials: true
    };
    return (tgt ? of(tgt) : fromPromise(this.storage.get('tgt'))).pipe(
      switchMap(tgt => this.http.post(`${this.casUrl}/cas/v1/tickets/${tgt}`, null, options).pipe(
        catchError(_ => this.getTGT().pipe(
          switchMap(tgt => this.getST(serviceUrl, tgt))
        ))
      ))
    );
  }

  /**
   * DELETE: delete ticket granting ticket
   * Use `tgt` from storage if not provided.
   * @param tgt - ticket granting ticket (default: cached `tgt`)
   */
  deleteTGT(tgt?: string): Observable<string> {
    const options = {
      responseType: 'text' as 'text',
      withCredentials: true
    };
    return (tgt ? of(tgt) : fromPromise(this.storage.get('tgt'))).pipe(
      switchMap(tgt => this.http.delete(this.casUrl + '/cas/v1/tickets/' + tgt, options))
    );
  }

  /**
   * GET: ??
   * @return tgt
   */
  validate(st?: any): Observable<any> {

    const options = {
      headers: { 'Content-type': 'application/x-www-form-urlencoded' },
      params: { 'format': 'json', 'service': this.casUrl, 'ticket': st },
      withCredentials: true
    };

    return this.http.get(this.casUrl + '/cas/p3/serviceValidate', options).pipe(
      switchMap(res =>
        res['serviceResponse']['authenticationSuccess']['attributes']['distinguishedName']
          .join().toLowerCase().split(',').indexOf('ou=students') !== -1 ||
          res['serviceResponse']['authenticationSuccess']['attributes']['distinguishedName']
            .join().toLowerCase().split(',').indexOf('ou=academic') !== -1 ||
          res['serviceResponse']['authenticationSuccess']['attributes']['distinguishedName']
            .join().toLowerCase().split(',').indexOf('ou=apiit tpm') !== -1
          ? of(res) : obs_throw('Group not supported')
      ),
      tap(res => this.validationResponse = res['serviceResponse']['authenticationSuccess']['attributes']['distinguishedName'].join().toLowerCase().split(',')),
      tap(_ => this.storage.set('userGroup', this.validationResponse))
    )
  }
}
