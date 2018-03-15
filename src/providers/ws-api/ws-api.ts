import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Platform, ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Network } from '@ionic-native/network';

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
   * @return shared cached observable
   */
  get<T>(endpoint: string, refresh?: boolean, options: {
    timeout?: number,
    auth?: boolean,
  } = {}): Observable<T> {
    const url = this.apiUrl + endpoint;
    const opt = { withCredentials: Boolean(options.auth !== false) };

    return (refresh && (!this.plt.is('cordova') || this.network.type !== 'none')
      ? this.http.get<T>(url, opt)
      .catch(err => options.auth === false ? Observable.throw(err)
        : this.cas.getST(url).switchMap(st => this.http.get<T>(`${url}?ticket=${st}`, opt)))
      .do(cache => this.storage.set(endpoint, cache)).timeout(options.timeout || 5000)
      .catch(err => {
        this.toastCtrl.create({ message: err.message, duration: 3000 }).present();
        return Observable.fromPromise(this.storage.get(endpoint));
      })
      : Observable.fromPromise(this.storage.get(endpoint))
      .switchMap(v => v ? Observable.of(v) : this.get(endpoint, true, options))
    ).publishLast().refCount();
  }
}
