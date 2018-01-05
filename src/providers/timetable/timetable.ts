import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

import { Observable } from 'rxjs/Observable';
import { tap, catchError } from 'rxjs/operators';

import { Timetable } from '../../interfaces/timetable';

@Injectable()
export class TimetableProvider {

  // timetable$: ReplaySubject<Timetable[]> = new ReplaySubject(1);
  timetable$: Observable<Timetable[]>;

  constructor(
    public http: HttpClient,
    public storage: Storage
  ) { }

  /** GET: timetable */
  getTimetable(refresh: boolean = false): Observable<Timetable[]> {
    const service = 'http://127.0.0.1:8000/weektimetable';
    if (refresh) {
      // this.http.get<Timetable[]>(service).timeout(3000).subscribe({
      //   next: v => {
      //     this.timetable$.next(v);
      //     this.timetable$.complete();
      //     this.storage.set('timetable', v);
      //   },
      //   error: this.timetable$.error
      // });
      this.timetable$ = this.http.get<Timetable[]>(service).timeout(3000).pipe(
        tap(cache => this.storage.set('timetable', cache)),
        catchError(_ => Observable.from(this.storage.get('timetable')))
      ).publishLast().refCount();
      // } else if (!this.timetable$.observers.length) {
    } else if (!this.timetable$ || !this.timetable$.takeLast(1)) {
      // this.storage.get('timetable')
      //   .then(this.timetable$.next)
      //   .catch(_ => this.getTimetable(true));
      this.timetable$ = Observable.from(this.storage.get('timetable'))
        .switchMap(v => v ? Observable.of(v) : this.getTimetable(true))
        .publishLast().refCount();
    }
    return this.timetable$;
  }

}
