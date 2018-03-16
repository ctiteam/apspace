import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';

/**
 * CAS Authentication with fallback mechanism.
 *
 *               Authenticate        (request on failure/after login)
 * +-------------+ -------> +--------+  - - - > +-------+  - - - > +---------+
 * | user:logout |          | getTGT |          | getST |          | Service |
 * +-------------+ <-x----- +--------+ <------- +-------+ <------- +---------+
 *         Invalid Credentials      Service Ticket       PHP Session
 *          (Observable.never)         Expired             Expired
 */
@Injectable()
export class CasTicketProvider {

  casUrl = 'https://cas.apiit.edu.my';

  constructor(
    public http: HttpClient,
    public storage: Storage,
    public events: Events,
  ) { }

  /**
   * POST: request ticket-granting ticket from CAS and cache tgt and credentials
   * If username and password are not provided, use `cred` from storage and
   * logout and return never() instead of throwing an error on failure.
   * @param username - username for CAS
   * @param password - password for CAS
   */
  getTGT(username?: string, password?: string): Observable<string> {
    const options = {
      headers: { 'Content-type': 'application/x-www-form-urlencoded' },
      observe: 'response' as 'body'
    };
    return (username && password
      ? Observable.of(`username=${username}&password=${password}`)
      : Observable.fromPromise(this.storage.get('cred'))
    ).switchMap(data =>
      this.http.post(this.casUrl + '/cas/v1/tickets', data, options)
      .catch(res => res.status === 201 && res.headers.get('Location')
        ? Observable.of(res.headers.get('Location').split('/').pop())
        : username && password
        ? Observable.throw('Invalid credentials')
        : this.events.publish('user:logout') || Observable.never())
      .do(tgt => this.storage.set('tgt', tgt))
      .do(_ => this.storage.set('cred', data))
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
    return (tgt ? Observable.of(tgt) : Observable.fromPromise(this.storage.get('tgt')))
    .switchMap(tgt =>
      this.http.post(`${this.casUrl}/cas/v1/tickets/${tgt}`, null, options)
      .catch(_ => this.getTGT().switchMap(tgt => this.getST(serviceUrl, tgt)))
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
    return (tgt ? Observable.of(tgt) : Observable.fromPromise(this.storage.get('tgt')))
    .switchMap(tgt => this.http.delete(this.casUrl + '/cas/v1/tickets/' + tgt, options));
  }
}
