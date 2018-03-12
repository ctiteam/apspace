import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { Timetable } from '../../interfaces/timetable';

@Injectable()
export class TimetableProvider {

  timetable$: Observable<Timetable[]>;

  constructor(
    public http: HttpClient,
    public storage: Storage,
    public toastCtrl: ToastController,
  ) { }

  /** GET: timetable */
  getTimetable(refresh: boolean = false): Observable<Timetable[]> {
    const service = 'https://ws.apiit.edu.my/web-services/index.php/open/weektimetable';

    if (refresh) {
      this.timetable$ = this.http.get<Timetable[]>(service).timeout(1000)
      .do(cache => this.storage.set('timetable', cache))
      .catch(err => this.toastCtrl.create({ message: err.message, duration: 1000 }).present()
        || Observable.from(this.storage.get('timetable')));
    } else {
      this.timetable$ = Observable.from(this.storage.get('timetable'))
        .switchMap(v => v ? Observable.of(v) : this.getTimetable(true));
    }
    return this.timetable$.publishLast().refCount();
  }

}
