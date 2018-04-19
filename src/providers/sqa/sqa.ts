import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { publishLast, refCount, switchMap } from 'rxjs/operators';

import { CasTicketProvider } from '../cas-ticket/cas-ticket';
import { Sqa } from '../../interfaces';

@Injectable()
export class SqaProvider {

  sqaUrl = 'https://api.apiit.edu.my/sqa/';

  constructor(public http: HttpClient, private cas: CasTicketProvider) { }

  /**
   * GET: Get Questions & Answers.
   */
  get(): Observable<Sqa> {
    return this.cas.getST(this.sqaUrl).pipe(
      switchMap(st => this.http.get<Sqa>(this.sqaUrl, { params: { ticket: st } }))
    ).pipe(publishLast(), refCount());
  }

  /**
   * POST: Set Questions & Answers.
   */
  set(config: Sqa): Observable<any> {
    const params = new HttpParams({ fromObject: { ...config } });
    return this.cas.getST(this.sqaUrl).pipe(
      switchMap(st => this.http.post(this.sqaUrl, params.toString(), {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        params: { ticket: st }
      }))
    ).pipe(publishLast(), refCount());
  }


}
