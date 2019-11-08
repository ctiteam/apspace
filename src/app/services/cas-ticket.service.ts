/* tslint:disable:no-shadowed-variable */
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { EMPTY, from as fromPromise, Observable, of, throwError } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';

import { Role } from '../interfaces';
import { SettingsService } from './settings.service';

/**
 * CAS Authentication with fallback mechanism.
 *
 *          Authentication <--+
 *                            v               (post-login)
 * +-------------+          +--------+  - - - > +-------+  - - - > +---------+
 * | user:logout |          | getTGT |          | getST |          | Service |
 * +-------------+ <-x----- +--------+ <------- +-------+ <------- +---------+
 *         Invalid Credentials      Service Ticket     Session Expired
 *          (Observable.EMPTY)         Expired         (if applicable)
 */
@Injectable({
  providedIn: 'root'
})
export class CasTicketService {

  readonly casUrl = 'https://cas.apiit.edu.my';

  /**
   * Check if user is authenticated against presence of tgt in storage.
   */
  readonly isAuthenticated: Promise<boolean>;

  constructor(
    public http: HttpClient,
    public storage: Storage,
    public router: Router,
    private settings: SettingsService,
  ) {
    this.isAuthenticated = storage.get('tgt').then(tgt => !!tgt);
  }

  /**
   * POST: request ticket-granting ticket from CAS and cache tgt and credentials
   * If username and password are not provided, use `cred` from storage and
   * logout and return EMPTY instead of throwing an error on failure.
   * @param username CAS username
   * @param password CAS password
   */
  getTGT(username?: string, password?: string): Observable<string> {
    const options = {
      headers: { 'Content-type': 'application/x-www-form-urlencoded' },
      observe: 'response' as 'body',
    };
    return (username && password
      ? of(new HttpParams().set('username', username).set('password', password).toString())
      : fromPromise(this.storage.get('cred'))
    ).pipe(
      switchMap(data => this.http.post(this.casUrl + '/cas/v1/tickets', data, options).pipe(
        catchError(res => res.status === 201 && res.headers.get('Location')
          ? of(res.headers.get('Location').split('/').pop())
          : username && password
            ? throwError(res)
            : (this.router.navigate(['/logout']), EMPTY)),
        tap(tgt => this.storage.set('tgt', tgt)),
        tap(_ => this.storage.set('cred', data)),
      )),
    );
  }

  /**
   * POST: request service ticket from CAS
   * Use `tgt` from storage if not provided.
   * @param serviceUrl Service url for CAS authentication
   * @param tgt Ticket granting ticket (default: cached `tgt`)
   */
  getST(serviceUrl: string = this.casUrl, tgt?: string | {}): Observable<string> {
    const options = {
      headers: { 'Content-type': 'application/x-www-form-urlencoded' },
      params: { service: serviceUrl },
      responseType: 'text' as 'text', /* TODO: fix this in future angular */
      withCredentials: true,
    };
    return (tgt ? of(tgt) : fromPromise(this.storage.get('tgt'))).pipe(
      switchMap(tgt => this.http.post(`${this.casUrl}/cas/v1/tickets/${tgt}`, null, options)),
      catchError(err => err.status !== 0
        ? this.getTGT().pipe(switchMap(tgt => this.getST(serviceUrl, tgt)))
        : throwError(new Error('No network'))),
    );
  }

  /**
   * DELETE: delete ticket granting ticket
   * Use `tgt` from storage if not provided.
   * @param tgt Ticket granting ticket (default: cached `tgt`)
   */
  deleteTGT(tgt?: string): Observable<string> {
    const options = {
      responseType: 'text' as 'text',
      withCredentials: true,
    };
    return (tgt ? of(tgt) : fromPromise(this.storage.get('tgt'))).pipe(
      switchMap(tgt => this.http.delete(this.casUrl + '/cas/v1/tickets/' + tgt, options)),
    );
  }

  /**
   * GET: Validate service ticket and set role to user
   *
   * @param st Service ticket
   * @return tgt Ticket granting ticket
   */
  validate(st?: string): Observable<Role> {

    const options = {
      headers: { 'Content-type': 'application/x-www-form-urlencoded' },
      params: { format: 'json', service: this.casUrl, ticket: st },
      withCredentials: true,
    };

    return this.http.get<any>(this.casUrl + '/cas/p3/serviceValidate', options).pipe(
      switchMap(res => {
        const parts = res.serviceResponse.authenticationSuccess.attributes.distinguishedName
          .join().toLowerCase().split(',');
        let role: Role = 0;

        /* tslint:disable:no-bitwise */
        if (parts.indexOf('ou=students') !== -1) {
          role |= Role.Student;
        }
        if (parts.indexOf('ou=academic') !== -1) {
          role |= Role.Lecturer;
        }
        if (parts.indexOf('ou=apiit tpm') !== -1) {
          role |= Role.Admin;
        }
        /* tslint:enable:no-bitwise */
        if (!role) {
          this.storage.clear();
          return throwError(new Error('Group not supported'));
        }

        this.settings.set('role', role);
        return of(role);
      }),
    );
  }
}
