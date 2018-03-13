import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { CasTicketProvider } from '../cas-ticket/cas-ticket';
import { StaffDirectory } from '../../interfaces/staff-directory';

@Injectable()
export class StaffDirectoryProvider {

  staff$: Observable<StaffDirectory[]>;

  constructor(
    public http: HttpClient,
    public storage: Storage,
    public toastCtrl: ToastController,
    private casService: CasTicketProvider,
  ) { }

  /** GET: staff directory */
  getStaffDirectory(refresh: boolean = false): Observable<StaffDirectory[]> {
    const service = 'https://ws.apiit.edu.my/web-services/index.php/staff/listing';
    const options = { withCredentials: true };

    if (refresh) {
      this.staff$ = this.http.get<StaffDirectory[]>(service, options)
        .catch(_ => this.casService.getST(service)
          .switchMap(st => this.http.get<StaffDirectory[]>(`${service}?ticket=${st}`, options)))
        .do(cache => this.storage.set('staffDirectory', cache)).timeout(2000)
        .catch(err => {
          this.toastCtrl.create({ message: err.message, duration: 3000 }).present()
          return Observable.fromPromise(this.storage.get('staffDirectory'))
        })
    } else {
      this.staff$ = Observable.fromPromise(this.storage.get('staffDirectory'))
        .switchMap(v => v ? Observable.of(v) : this.getStaffDirectory(true));
    }
    return this.staff$.publishLast().refCount();
  }

}
