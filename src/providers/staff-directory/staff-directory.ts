import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { Observable } from 'rxjs/Observable';
import { catchError, tap } from 'rxjs/operators';

import { CasTicketProvider } from '../cas-ticket/cas-ticket';
import { StaffDirectory } from '../../interfaces/staff-directory';

@Injectable()
export class StaffDirectoryProvider {

  staff$: Observable<StaffDirectory[]>;

  constructor(
    public http: HttpClient,
    public storage: Storage,
    public toastCtrl: ToastController,
    private casService: CasTicketProvider
  ) { }

  /** GET: get staff directory */
  getStaffDirectory(refresh: boolean = false): Observable<StaffDirectory[]> {
    const service = 'https://ws.apiit.edu.my/web-services/index.php/staff/listing';

    if (refresh) {
      const options = { withCredentials: true };
      // this.staff$ = this.casService.getSTOld(service).switchMap(ticket =>
      //   this.http.get<StaffDirectory[]>(service, { withCredentials: true })
      //   .timeout(1000).pipe(
      //     tap(cache => this.storage.set('staffDirectory', cache)),
      //     tap(_ => console.log('tap')),
      //     catchError(err => {
      //       this.toastCtrl.create({ message: err.message, duration: 1000 }).present();
      //       return Observable.from(this.storage.get('staffDirectory'));
      //     })
      //   )
      // ).publishLast().refCount();
      this.staff$ = this.http.get<StaffDirectory[]>(service, options)
        .timeout(1000).pipe(
          tap(cache => this.storage.set('staffDirectory', cache)),
          tap(_ => console.log('tap')),
          catchError(_ =>
            this.casService.getSTOld(service).switchMap(ticket =>
              this.http.get<StaffDirectory[]>(`${service}?ticket=${ticket}`, options)
              .catch(err => {
                this.toastCtrl.create({ message: err.message, duration: 3000 }).present();
                return Observable.from(this.storage.get('staffDirectory'));
              }))),
        ).publishLast().refCount();
    // } else if (!this.staff$ || !this.staff$.takeLast(1)) {
    } else {
      console.log('no refresh');
      this.staff$ = Observable.from(this.storage.get('staffDirectory'))
        .switchMap(v => v ? Observable.of(v) : this.getStaffDirectory(true))
        .publishLast().refCount();
    }
    return this.staff$;
  }

}
