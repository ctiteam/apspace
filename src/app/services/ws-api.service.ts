import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Network } from '@ionic-native/network/ngx';
import { Storage } from '@ionic/storage';
import { Platform, ToastController } from '@ionic/angular';

import { Observable, from, of, range, throwError, timer, zip } from 'rxjs';
import {
  catchError, map, mergeMap, publishLast, refCount, retryWhen, switchMap, tap,
  timeout,
} from 'rxjs/operators';

import { CasTicketService } from './cas-ticket.service';

@Injectable({
  providedIn: 'root'
})
export class WsApiService {

  apiUrl = 'https://api.apiit.edu.my';

  constructor(
    public http: HttpClient,
    public plt: Platform,
    public network: Network,
    public storage: Storage,
    public toastCtrl: ToastController,
    private cas: CasTicketService,
  ) { }

  /**
   * GET: Request WS API with cache and error handling.
   *
   * @param endpoint - <apiUrl><endpoint> for service, used for caching
   * @param refresh - force refresh (default: false)
   * @param options.attempts - number of retries (default: 4)
   * @param options.auth - authentication required (default: true)
   * @param options.params - additional request parameters (default: {})
   * @param options.timeout - request timeout (default: 10000)
   * @param options.url - url of web service (default: apiUrl)
   * @return shared cached observable
   */
  get<T>(endpoint: string, refresh?: boolean, options: {
    attempts?: number,
    auth?: boolean,
    params?: HttpParams | { [param: string]: string | string[]; },
    timeout?: number,
    url?: string,
  } = {}): Observable<T> {
    options = Object.assign({
      attempts: 4,
      auth: true,
      params: {},
      timeout: 20000,
      url: this.apiUrl,
    }, options);

    const url = options.url + endpoint;
    const opt = {
      params: options.params,
      withCredentials: options.auth,
    };

    return (refresh && (!this.plt.is('cordova') || this.network.type !== 'none')
      ? (!options.auth // always get ticket if auth is true
        ? this.http.get<T>(url, opt)
        : this.cas.getST(url.split('?').shift()).pipe( // remove service url params
          switchMap(ticket => this.http.get<T>(url, { ...opt, params: { ...opt.params, ticket } })))
      ).pipe(
        tap(cache => this.storage.set(endpoint, cache)),
        timeout(options.timeout),
        catchError(err => {
          this.toastCtrl.create({ message: err.message, duration: 3000, position: 'top' })
            .then(toast => toast.present());
          return from(this.storage.get(endpoint)).pipe(
            switchMap(v => v || throwError('retrying')),
          );
        }),
        retryWhen(errors => zip(range(1, options.attempts), errors).pipe(
          map((i: number | any) => 2 ** i + Math.random() * 8), // 2^n + random 0-8
          mergeMap(i => timer((2 ** i + Math.random() * 8) * 1000)),
        )),
        catchError(of),
      )
      : from(this.storage.get(endpoint)).pipe(
        switchMap(v => v ? of(v) : this.get(endpoint, true, options)),
      )
    ).pipe(publishLast(), refCount());
  }

  /**
   * POST: Simple request WS API.
   *
   * @param endpoint - <apiUrl><endpoint> for service, used for caching
   * @param options.body - request body (default: null)
   * @param options.headers - http headers (default: {})
   * @param options.params - additional request parameters (default: {})
   * @param options.timeout - request timeout (default: 10000)
   * @param options.url - url of web service (default: apiUrl)
   * @return shared cached observable
   */
  post<T>(endpoint: string, options: {
    body?: any | null,
    headers?: HttpHeaders | { [header: string]: string | string[]; },
    params?: HttpParams | { [param: string]: string | string[]; },
    timeout?: number,
    url?: string,
  } = {}): Observable<T> {
    options = Object.assign({
      body: null,
      headers: {},
      params: {},
      timeout: 10000,
      url: this.apiUrl,
    }, options);

    const url = options.url + endpoint;
    const opt = {
      headers: options.headers,
      params: options.params,
      withCredentials: true,
    };

    if (this.plt.is('cordova') && this.network.type === 'none') {
      this.toastCtrl.create({
        message: 'You are now offline.',
        duration: 3000,
        position: 'top',
      }).then(toast => toast.present());
      return throwError('offline');
    }

    return this.cas.getST(url.split('?').shift()).pipe(
      switchMap(ticket => this.http.post<T>(url, options.body,
        { ...opt, params: { ...opt.params, ticket } })),
      timeout(options.timeout),
      publishLast(),
      refCount(),
    );
  }

}
