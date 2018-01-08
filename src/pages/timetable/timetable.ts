import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, ToastController, ModalController,
  Content } from 'ionic-angular';

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

  timetable$: Observable<Timetable[]>;
  staff$: Observable<StaffDirectory[]>;
  staff = [] as StaffDirectory[];
  selectedDay: string;

  @ViewChild(Content) content: Content;

  /* config */
  intake: string = 'UC1F1705CS(DA)';

  constructor(
    public navCtrl: NavController,
    public toastCtrl: ToastController,
    public modalCtrl: ModalController,
    private sd: StaffDirectoryProvider,
    private tt: TimetableProvider,
  ) { }

  /** Set the data with TimetableConfPage */
  confPage(): void {
    let conf = this.modalCtrl.create('TimetableConfPage', { intake: this.intake });
    conf.onDidDismiss(data => {
      console.log('data', data['intake']);
      this.intake = data['intake'];
    });
    conf.present();
    this.timetable$ = this.tt.getTimetable().pipe(tap(tt => this.updateDay(tt)));
  }

  /** TODO: Get staff from timetable */
  getStaff(t: Timetable): Observable<string> {
    return this.staff$.map(ss => {
      console.log(ss.length);
      return ss.find(s => s.ID === t.LECTID).FULLNAME
    });
    // return this.staff.length ? this.staff.find(s => s.ID === t.LECTID).FULLNAME : '';
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
    days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"]
      .filter(d => days.indexOf(d) !== -1);
    return days;
  }

  /** Update value of selected day in segment. */
  updateDay(tt: Timetable[]): void {
    let days = this.schoolDays(tt);
    if (!this.selectedDay || days.indexOf(this.selectedDay) === -1) {
      this.selectedDay = days.shift();
    }
    this.content.resize();
  }

  doRefresh(refresher) {
    let t = this.toastCtrl.create({ message: 'Request fail', duration: 3000 });
    this.timetable$ = this.tt.getTimetable(true).pipe(
      tap(tt => this.updateDay(tt)),
      catchError(err => t.present(err)),
      finalize(() => refresher.complete()),
    );
  }

  ionViewDidLoad() {
    this.staff$ = this.sd.getStaffDirectory();
    this.sd.getStaffDirectory().subscribe(staff => this.staff = staff);
    this.timetable$ = this.tt.getTimetable().pipe(tap(tt => this.updateDay(tt)));
  }

}
