import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Network } from '@ionic-native/network';
import { Storage } from '@ionic/storage';
import { Platform, ToastController } from 'ionic-angular';

import { Observable } from 'rxjs/Observable';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { of } from 'rxjs/observable/of';
import { range } from 'rxjs/observable/range';
import { _throw as obs_throw } from 'rxjs/observable/throw';
import { timer } from 'rxjs/observable/timer';
import {
  catchError, mergeMap, publishLast, refCount, retryWhen, switchMap,
  tap, timeout, zip,
} from 'rxjs/operators';

import { CasTicketProvider } from './';

@Injectable()
export class WsApiProvider {

  oldApiUrl = 'https://ws.apiit.edu.my/web-services/index.php';
  apiUrl = 'https://api.apiit.edu.my';

  constructor(
    public http: HttpClient,
    public plt: Platform,
    public network: Network,
    public storage: Storage,
    public toastCtrl: ToastController,
    private cas: CasTicketProvider,
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
   * @param options.url - url of web service (default: this.apiUrl)
   * @return shared cached observable
   */
  get<T>(endpoint: string, refresh?: boolean, options: {
    attempts?: number,
    auth?: boolean,
    params?: HttpParams | { [param: string]: string | string[]; },
    timeout?: number,
    url?: string,
  } = {}): Observable<T> {
    let url;
    let serviceUrl;
    const opt = {
      params: options.params || {},
      withCredentials: Boolean(options.auth !== false),
    };

    // all student/ still uses old api
    if (endpoint.indexOf('student/') === -1) {
      url = (options.url || this.apiUrl) + endpoint;
      serviceUrl = (options.url || this.apiUrl) + endpoint;
    } else if(endpoint.indexOf('student/attendance') === 1) {
      url = (options.url || this.apiUrl) + endpoint;
      serviceUrl = `${this.apiUrl}/student/attendance`;
    } else {
      url = (options.url || this.oldApiUrl) + endpoint;
      serviceUrl = (options.url || this.oldApiUrl) + endpoint;
      // opt.params.source = 'mobile';
    }

    return (refresh && (!this.plt.is('cordova') || this.network.type !== 'none')
      ? (options.auth === false // always get ticket if auth is true
        ? this.http.get<T>(url, opt)
        : this.cas.getST(serviceUrl).pipe(switchMap(st => this.http.get<T>(url,
          Object.assign(opt, { params: Object.assign(opt.params, { ticket: st }) }))))
      ).pipe(
        tap(cache => this.storage.set(endpoint, cache)),
        timeout(options.timeout || 10000),
        catchError(err => {
          // this.toastCtrl.create({ message: err.message, duration: 3000 }).present();
          return fromPromise(this.storage.get(endpoint)).pipe(
            switchMap(v => v || obs_throw('retrying')),
          );
        }),
        retryWhen(errors => range(1, options.attempts || 4).pipe(
          zip(errors, i => 2 ** i + Math.random() * 8), // 2^n + random 0-8
          mergeMap(i => timer(i * 1000)),
        )),
        catchError(of),
      )
      : fromPromise(this.storage.get(endpoint)).pipe(
        switchMap(v => v ? of(v) : this.get(endpoint, true, options)),
      )
    ).pipe(publishLast(), refCount());
  }

  /**
   * POST: Simple request WS API.
   *
   * @param endpoint - <apiUrl><endpoint> for service, used for caching
   * @param options.headers - http headers
   * @param options.body - request body (default: null)
   * @param options.params - additional request parameters (default: {})
   * @param options.timeout - request timeout (default: 10000)
   * @param options.url - url of web service (default: this.apiUrl)
   * @return shared cached observable
   */
  post<T>(endpoint: string, options: {
    body?: any | null,
    headers?: HttpHeaders | { [header: string]: string | string[]; },
    params?: HttpParams | { [param: string]: string | string[]; },
    timeout?: number,
    url?: string,
  } = {}): Observable<T> {
    const url = (options.url || this.apiUrl) + endpoint;
    const opt = {
      headers: options.headers || {},
      params: options.params || {},
      withCredentials: true,
    };

    if (this.plt.is('cordova') && this.network.type === 'none') {
      this.toastCtrl.create({
        message: 'You are now offline.',
        duration: 3000,
        position: 'top',
      }).present();
      return obs_throw('offline');
    }

    return this.cas.getST().pipe(
      switchMap(st => this.http.post<T>(url, options.body || null,
        Object.assign(opt, { params: Object.assign(opt.params, { ticket: st }) }))),
      timeout(options.timeout || 10000),
      publishLast(),
      refCount(),
    );
  }

}
