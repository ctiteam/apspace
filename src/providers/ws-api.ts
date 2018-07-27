import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Platform, ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Network } from '@ionic-native/network';

import { Observable } from 'rxjs/Observable';
import { _throw as obs_throw } from 'rxjs/observable/throw';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { of } from 'rxjs/observable/of';
import { range } from 'rxjs/observable/range';
import { timer } from 'rxjs/observable/timer';
import {
  catchError, mergeMap, publishLast, refCount, retryWhen, switchMap,
  tap, timeout, zip
} from 'rxjs/operators';

import { CasTicketProvider } from './';

@Injectable()
export class WsApiProvider {

  apiUrl = 'https://ws.apiit.edu.my/web-services/index.php';
  apiUrlStaff = 'https://api.apiit.edu.my/monthlyreturns/view/all-employees';

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
   * @param endpoint - <apiUrl>/<endpoint> for service, used for caching
   * @param refresh - force refresh (default: false)
   * @param options.attempts - number of retries (default: 4)
   * @param options.auth - authentication required (default: true)
   * @param options.params - additional request parameters (default: {})
   * @param options.timeout - request timeout (default: 10000)
   * @param options.url - url of webservice (default: this.apiUrl)
   * @return shared cached observable
   */
  get<T>(endpoint: string, refresh?: boolean, options: {
    attempts?: number,
    auth?: boolean,
    params?: any,
    timeout?: number,
    url?: string,
  } = {}): Observable<T> {
    const url = (options.url || this.apiUrl) + endpoint;
    const opt = {
      withCredentials: Boolean(options.auth !== false),
      params: options.params || {},
    };

    return (refresh && (!this.plt.is('cordova') || this.network.type !== 'none')
      ? this.http.get<T>(url, opt).pipe(
        catchError(err => options.auth === false ? obs_throw(err)
          : this.cas.getST(url).pipe(
            switchMap(st => this.http.get<T>(url,
              Object.assign(opt, { params: Object.assign(opt.params, { ticket: st }) })))
          )),
        tap(cache => this.storage.set(endpoint, cache)),
        timeout(options.timeout || 10000),
        catchError(err => {
          this.toastCtrl.create({ message: err.message, duration: 3000 }).present();
          return fromPromise(this.storage.get(endpoint)).pipe(
            switchMap(v => v || obs_throw('retrying'))
          );
        }),
        retryWhen(errors => range(1, options.attempts || 4).pipe(
          zip(errors, i => 2 ** i + Math.random() * 8), // 2^n + random 0-8
          mergeMap(i => timer(i * 1000)),
        )),
        catchError(of),
      )
      : fromPromise(this.storage.get(endpoint)).pipe(
        switchMap(v => v ? of(v) : this.get(endpoint, true, options))
      )
    ).pipe(publishLast(), refCount());
  }

}
