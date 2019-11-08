import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Network } from '@ionic-native/network/ngx';
import { Platform, ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage';

import { concat, from, iif, Observable, of, throwError } from 'rxjs';
import {
  catchError, concatMap, delay, publishLast, refCount, retryWhen, switchMap,
  tap, timeout,
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
   * Caching strategies inspired by https://serviceworke.rs/caching-strategies.html
   *
   * @param endpoint - <apiUrl><endpoint> for service, used for caching
   * @param options.attempts - number of retries (default: 4)
   * @param options.auth - authentication required (default: true)
   * @param options.params - additional request parameters (default: {})
   * @param options.caching - caching strategies (default: true)
   * @param options.timeout - request timeout (default: 10000)
   * @param options.url - url of web service (default: apiUrl)
   * @param options.headers - http headers (default: {})
   * @return data observable
   */
  get<T>(endpoint: string, options: {
    attempts?: number,
    auth?: boolean,
    headers?: HttpHeaders | { [header: string]: string | string[]; },
    params?: HttpParams | { [param: string]: string | string[]; },
    caching?: 'network-or-cache' | 'cache-only' | 'cache-update-refresh',
    timeout?: number,
    url?: string
  } = {}): Observable<T> {
    options = Object.assign({
      attempts: 4,
      auth: true,
      headers: {},
      params: {},
      caching: 'network-or-cache',
      timeout: 20000,
      url: this.apiUrl
    }, options);

    const url = options.url + endpoint;
    const opt = {
      params: options.params,
      withCredentials: options.auth,
      headers: options.headers
    };

    const request$ = (!options.auth // always get ticket if auth is true
      ? this.http.get<T>(url, opt)
      : this.cas.getST(url.split('?').shift()).pipe( // remove service url params
        switchMap(ticket => this.http.get<T>(url, { ...opt, params: { ...opt.params, ticket } })),
        catchError(() => this.storage.get(endpoint)), // no network
      )
    ).pipe(
      tap(cache => this.storage.set(endpoint, cache)),
      timeout(options.timeout),
      catchError(err => {
        this.toastCtrl.create({ message: err.message, duration: 3000, position: 'top' })
          .then(toast => toast.present());
        return from(this.storage.get(endpoint)).pipe(
          switchMap(v => v ? of(v as T) : throwError(new Error('retrying'))),
        );
      }),
      retryWhen(errors => errors.pipe(
        concatMap((err, n) => iif( // use concat map to keep errors in order (not parallel)
          () => n < options.attempts,
          of(err).pipe(delay((2 ** (n + 1) + Math.random() * 8) * 1000)), // 2^n + random 0-8
          throwError(err), // propagate error if all retries failed
        ))
      )),
    );

    if (options.caching !== 'cache-only' && (!this.plt.is('cordova') || this.network.type !== 'none')) {
      return options.caching === 'cache-update-refresh'
        ? concat(from(this.storage.get(endpoint)), request$)
        : request$;
    } else { // force request not cached
      return from(this.storage.get(endpoint)).pipe(
        switchMap(v => v ? of(v) : this.get<T>(endpoint, { ...options, caching: 'network-or-cache' })),
      );
    }
  }

  /**
   * POST: Simple request WS API.
   *
   * @param endpoint - <apiUrl><endpoint> for service, used for caching
   * @param options.body - request body (default: null)
   * @param options.headers - http headers (default: {})
   * @param options.params - additional request parameters (default: {})
   * @param options.timeout - request timeout (default: 10000)
   * @param options.auth - authentication required (default: true)
   * @param options.url - url of web service (default: apiUrl)
   * @return data observable
   */
  post<T>(endpoint: string, options: {
    body?: any | null,
    headers?: HttpHeaders | { [header: string]: string | string[]; },
    params?: HttpParams | { [param: string]: string | string[]; },
    timeout?: number,
    auth?: boolean,
    url?: string,
  } = {}): Observable<T> {
    options = Object.assign({
      body: null,
      headers: {},
      params: {},
      timeout: 10000,
      auth: true,
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
      return throwError(new Error('offline'));
    }

    return (!options.auth // always get ticket if auth is true
      ? this.http.post<T>(url, opt)
      : this.cas.getST(url.split('?').shift()).pipe( // remove service url params
        switchMap(ticket => this.http.post<T>(url, { ...opt, params: { ...opt.params, ticket } })),
        catchError(() => this.storage.get(endpoint)), // no network
      )
    ).pipe(
      timeout(options.timeout),
      publishLast(),
      refCount(),
    );
  }

  put<T>(endpoint: string, options: {
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
      return throwError(new Error('offline'));
    }

    return this.cas.getST(url.split('?').shift()).pipe(
      switchMap(ticket => this.http.put<T>(url, options.body,
        { ...opt, params: { ...opt.params, ticket } })),
      timeout(options.timeout),
    );
  }

}
