import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, ToastController, ModalController,
  Content, Refresher } from 'ionic-angular';

import { Observable } from 'rxjs/Observable';
import { catchError, finalize, tap } from 'rxjs/operators';

import { StaffDirectory } from '../../interfaces/staff-directory';
import { StaffDirectoryProvider } from '../../providers/staff-directory/staff-directory';
import { Timetable } from '../../interfaces/timetable';
import { TimetableProvider } from '../../providers/timetable/timetable';

@IonicPage()
@Component({
  selector: 'page-timetable',
  templateUrl: 'timetable.html',
})
export class TimetablePage {

  wday = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  timetable$: Observable<Timetable[]>;
  selectedDay: string;

  @ViewChild(Content) content: Content;
  @ViewChild(Refresher) refresher: Refresher;

  /* config */
  intake: string = 'UC1F1705CS(DA)';

  constructor(
    public navCtrl: NavController,
    public toastCtrl: ToastController,
    public modalCtrl: ModalController,
    private sd: StaffDirectoryProvider,
    private tt: TimetableProvider,
  ) { }

  /** Set the data with TimetableConfPage. */
  confPage(): void {
    let conf = this.modalCtrl.create('TimetableConfPage', { intake: this.intake });
    conf.onDidDismiss(data => {
      if (this.intake !== data['intake']) {
        this.intake = data['intake'];
        this.timetable$.subscribe(tt => this.updateDay(tt));
      }
    });
    conf.present();
  }

  /** Get all classes for student. */
  classes(tt: Timetable[]): Timetable[] {
    if (tt) {
      return this.intake ? tt.filter(t => this.intake === t.INTAKE) : tt;
    }
    return [] as Timetable[];
  }

  /** Select the classes of the day. */
  theday(tt: Timetable[]): Timetable[] {
    return this.classes(tt).filter(t => t.DAY === this.selectedDay);
  }

  /** Get days in week of the classes. */
  schoolDays(tt: Timetable[]): string[] {
    let days = this.classes(tt).map(t => t.DAY);
    return this.wday.filter(d => days.indexOf(d) !== -1);
  }

  /** Update selected day in segment and style when day change. */
  updateDay(tt: Timetable[]): void {
    let days = this.schoolDays(tt);
    if (!this.selectedDay || days.indexOf(this.selectedDay) === -1) {
      this.selectedDay = days.shift();
    } else if (!days.length) {
      this.selectedDay = undefined;
    }
    this.content.resize();
  }

  /** Get and merge Timetable with StaffDirectory. */
  getTimetable(refresh: boolean = false): Observable<Timetable[]> {
    return this.tt.getTimetable(refresh).switchMap(tt => tt
      /* Find and merge with { ..t, STAFFNAME: s.FULLNAME } */
      ? this.sd.getStaffDirectory().map(ss => tt.map(t => <Timetable>Object.assign(t,
        { STAFFNAME: (ss.find(s => s.CODE === t.LECTID) || <StaffDirectory>{}).FULLNAME })))
      : Observable.empty()
    );
  }

  strToColor(s: string): string {
    let hash = 0;
    s.split('').forEach(c => hash = c.charCodeAt(0) + ((hash << 5) - hash));
    return '#' + [1,2,3].map(i => ('00' + (hash >> (i * 8) & 0xFF).toString(16))
                                  .substr(-2)).join('');
  }

  doRefresh(refresher) {
    let t = this.toastCtrl.create({ message: 'Request fail', duration: 3000 });
    this.timetable$ = this.getTimetable(true).pipe(
      tap(tt => this.updateDay(tt)),
      catchError(err => t.present(err)),
      finalize(() => refresher.complete()),
    );
  }

  ionViewDidLoad() {
    this.refresher.progress = -1; /* Never display the no classes card on load */
    this.timetable$ = this.getTimetable().pipe(tap(tt => this.updateDay(tt)));
  }

}
