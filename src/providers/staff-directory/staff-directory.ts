import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Storage } from '@ionic/storage';

import { Observable } from 'rxjs/Observable';
import { catchError, tap } from 'rxjs/operators';

import { CasTicketProvider } from '../cas-ticket/cas-ticket';
import { StaffDirectory } from '../../models/staff-directory';

@Injectable()
export class StaffDirectoryProvider {

  staffRequest$: Observable<StaffDirectory[]>;

  constructor(
    public http: HttpClient,
    public storage: Storage,
    private casService: CasTicketProvider
  ) {
    this.initProviderCache();
  }

  initProviderCache(): void {
    this.staffRequest$ = Observable.from(this.storage.get(this.constructor.name));
    this.staffRequest$ = this.getStaffDirectory(true);
  }

  /** GET: get lists of staff */
  getStaffDirectory(refresh: boolean = false): Observable<StaffDirectory[]> {
    const service = 'https://ws.apiit.edu.my/web-services/index.php/staff/listing';
    console.log(`last ${this.staffRequest$ && this.staffRequest$.takeLast(1)}`);
    if (refresh || !(this.staffRequest$ && this.staffRequest$.takeLast(1))) {
      this.staffRequest$ = this.casService.getTicket(service).switchMap(ticket =>
        this.http.get<StaffDirectory[]>(`${service}?ticket=${ticket}`, { withCredentials: true })
        .pipe(
          tap(cache => this.storage.set(this.constructor.name, cache)),
          catchError(_ => Observable.from(this.storage.get(this.constructor.name)))
        ).publishLast().refCount()
      );
    }
    return this.staffRequest$;
  }

  searchStaffDirectory(term: string): Observable<StaffDirectory[]> {
    return this.getStaffDirectory()
    .map(ss => ss.filter(s => s.FULLNAME.toLowerCase().indexOf(term.toLowerCase()) !== -1))
    .pipe(
      tap(_ => console.log(`found staffs matching ${term}`)),
      catchError(err => Observable.of([] as StaffDirectory[]))
    );
  }

}
