import { Component } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';

import { Observable } from 'rxjs/Observable';
import { catchError, finalize } from 'rxjs/operators';

import { TimetableProvider } from '../../providers/timetable/timetable';
import { Timetable } from '../../models/timetable';

@Component({
  selector: 'page-timetable',
  templateUrl: 'timetable.html',
})
export class TimetablePage {

  timetable$: Observable<Timetable[]>;
  timetables: any = [];

  constructor(
    public navCtrl: NavController,
    public toastCtrl: ToastController,
    private tt: TimetableProvider
  ) { }

  test: any;

  doRefresh(refresher) {
    let t = this.toastCtrl.create({ message: 'Request fail', duration: 3000 });
    this.timetable$ = this.tt.getTimetable(true).pipe(
      catchError(err => t.present(err)),
      finalize(() => refresher.complete()),
    );
  }

  ionViewDidLoad() {
    this.timetable$ = this.tt.getTimetable();
    this.timetable$.subscribe(console.log);
  }

  which(intake: string) {
    return (t: Timetable): boolean => intake === t.INTAKE;
  }

}
