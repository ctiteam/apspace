import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Platform, ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Network } from '@ionic-native/network';

import { Observable } from 'rxjs/Observable';
import { _throw as obs_throw } from 'rxjs/observable/throw';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { of } from 'rxjs/observable/of';
import { catchError, publishLast, refCount, retry, switchMap, tap, timeout } from 'rxjs/operators';

import { CasTicketProvider } from '../cas-ticket/cas-ticket';

@Injectable()
export class WsApiProvider {

  apiUrl = 'https://ws.apiit.edu.my/web-services/index.php';

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
   * @param options.timeout - request timeout (default: 5000)
   * @param options.auth - authentication required (default: true)
   * @param options.params - additional request parameters (default: {})
   * @return shared cached observable
   */
  get<T>(endpoint: string, refresh?: boolean, options: {
    timeout?: number,
    auth?: boolean,
    params?: any,
  } = {}): Observable<T> {
    const url = this.apiUrl + endpoint;
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
        retry(1),
        timeout(options.timeout || 5000),
        catchError(err => {
          this.toastCtrl.create({ message: err.message, duration: 3000 }).present();
          return fromPromise(this.storage.get(endpoint));
        })
      )
      : fromPromise(this.storage.get(endpoint)).pipe(
        switchMap(v => v ? of(v) : this.get(endpoint, true, options))
      )
    ).pipe(publishLast(), refCount());
  }
}
