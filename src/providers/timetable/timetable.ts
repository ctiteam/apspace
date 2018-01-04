import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

import { Observable } from 'rxjs/Observable';
import { catchError, tap } from 'rxjs/operators';

import { Timetable } from '../../models/timetable';

@Injectable()
export class TimetableProvider {

  timetable$: Observable<Timetable[]>;

  constructor(
    public http: HttpClient,
    public storage: Storage
  ) { }

  /** GET: timetable */
  getTimetable(refresh: boolean = false): Observable<Timetable[]> {
    const service = 'https://ws.apiit.edu.my/web-services/index.php/open/weektimetable';
    if (refresh) {
      this.timetable$ = this.http.get<Timetable[]>(service).timeout(3000).pipe(
        tap(cache => this.storage.set(this.constructor.name, cache)),
        catchError(_ => Observable.from(this.storage.get(this.constructor.name)))
      ).publishLast().refCount();
    } else if (!this.timetable$ || !this.timetable$.takeLast(1)) {
      this.timetable$ = Observable.from(this.storage.get(this.constructor.name))
        .map(v => v || this.getTimetable(true)).publishLast().refCount();
    }
    return this.timetable$;
  }

}
