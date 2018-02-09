import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

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
    private casService: CasTicketProvider
  ) { }

  /** GET: get staff directory */
  getStaffDirectory(refresh: boolean = false): Observable<StaffDirectory[]> {
    const service = 'https://ws.apiit.edu.my/web-services/index.php/staff/listing';
    if (refresh) {
      this.staff$ = this.casService.getST(service).switchMap(ticket =>
        this.http.get<StaffDirectory[]>(`${service}?ticket=${ticket}`, { withCredentials: true })
        .timeout(1000).pipe(
          tap(cache => this.storage.set('staffDirectory', cache)),
          catchError(_ => Observable.from(this.storage.get('staffDirectory')))
        ).publishLast().refCount()
      );
    } else if (!this.staff$ || !this.staff$.takeLast(1)) {
      this.staff$ = Observable.from(this.storage.get('staffDirectory'))
        .switchMap(v => v ? Observable.of(v) : this.getStaffDirectory(true))
        .publishLast().refCount();
    }
    return this.staff$;
  }

}
