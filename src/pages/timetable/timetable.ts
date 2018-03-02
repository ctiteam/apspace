import { Component, ViewChild } from '@angular/core';
import { ActionSheetController, ActionSheetButton, Content, IonicPage,
  NavController, Refresher } from 'ionic-angular';

import { Observable } from 'rxjs/Observable';
import { finalize, tap } from 'rxjs/operators';

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
  availableDays: string[];

  @ViewChild(Content) content: Content;
  @ViewChild(Refresher) refresher: Refresher;

  /* config */
  intake: string = '';

  constructor(
    public actionSheetCtrl: ActionSheetController,
    public navCtrl: NavController,
    private sd: StaffDirectoryProvider,
    private tp: TimetableProvider,
  ) { }

  presentActionSheet() {
    this.timetable$.subscribe(tt => {
      let intakes = Array.from(new Set((tt || []).map(t => t.INTAKE)))
        .map(intake => <ActionSheetButton>{
          text: intake,
          handler: () => {
            this.intake = intake;
            this.timetable$.subscribe(tt => this.updateDay(tt));
          }
        });
      let actionSheet = this.actionSheetCtrl.create({
        buttons: [
          {
            text: 'My Classes', handler: () => {
              this.intake = '';
              this.timetable$.subscribe(tt => this.updateDay(tt));
            }
          },
          ...intakes, { text: 'Cancel', role: 'cancel' }
        ]
      });
      actionSheet.present();
    });
  }

  /** Get all classes for student. */
  classes(tt: Timetable[]): Timetable[] {
    if (!this.intake) {
      return [] as Timetable[]; /* TODO: My Classes */
    } else if (Array.isArray(tt) && tt.length) {
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
    this.availableDays = this.schoolDays(tt);
    if (!this.selectedDay || this.availableDays.indexOf(this.selectedDay) === -1) {
      this.selectedDay = this.availableDays.shift();
    } else if (!this.availableDays.length) {
      this.selectedDay = undefined;
    }
    this.content.resize();
  }

  /** Get and merge Timetable with StaffDirectory. */
  getTimetable(refresh: boolean = false): Observable<Timetable[]> {
    return Observable.forkJoin([this.tp.getTimetable(refresh), this.sd.getStaffDirectory()])
      .map(data => data[0].map(t => <Timetable>Object.assign(t, { STAFFNAME:
        ((data[1] || []).find(s => s.CODE === t.LECTID) || <StaffDirectory>{}).FULLNAME })));
  }

  strToColor(s: string): string {
    let hash = 0;
    s.split('').forEach(c => hash = c.charCodeAt(0) + ((hash << 5) - hash));
    return '#' + [1,2,3].map(i => ('00' + (hash >> (i * 8) & 0xFF).toString(16))
                                  .substr(-2)).join('');
  }

  doRefresh(refresher, forceRefresh: boolean = true) {
    this.timetable$ = this.getTimetable(forceRefresh).pipe(
      tap(tt => this.updateDay(tt)),
      finalize(() => refresher.complete()),
    );
  }

  ionViewDidLoad() {
    this.refresher.progress = 1; /* Never display the no classes card on load */
    this.doRefresh(this.refresher, false);
  }

}
