import { DatePipe } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { ActionSheet, ActionSheetOptions } from '@ionic-native/action-sheet';
import {
  ActionSheetButton, ActionSheetController, App, Content, IonicPage,
  NavController, Platform,
} from 'ionic-angular';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { finalize, switchMap, tap } from 'rxjs/operators';

import { StudentProfile, Timetable } from '../../interfaces';
import { SettingsProvider, TimetableProvider, WsApiProvider } from '../../providers';
import { ClassesPipe } from './classes.pipe';

@IonicPage()
@Component({
  selector: 'page-timetable',
  templateUrl: 'timetable.html',
})
export class TimetablePage {

  wday = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  timetable$: Observable<Timetable[]>;
  selectedWeek: Date; // week is the first day of week
  availableWeek: Date[];
  selectedDate: Date;
  availableDate: Date[];
  availableDays: string[]; // wday[d.getDay()] for availableDate
  intakeLabels: string[] = [];

  @ViewChild(Content) content: Content;

  /* config */
  intake: string;

  constructor(
    public actionSheet: ActionSheet,
    public actionSheetCtrl: ActionSheetController,
    public navCtrl: NavController,
    public plt: Platform,
    private tt: TimetableProvider,
    private ws: WsApiProvider,
    private settings: SettingsProvider,
    public app: App,
  ) { }

  presentActionSheet(labels: string[], handler: (_: string) => void) {
    if (this.plt.is('cordova') && !this.plt.is('ios')) {
      const options: ActionSheetOptions = {
        buttonLabels: labels,
        addCancelButtonWithLabel: 'Cancel',
      };
      this.actionSheet.show(options).then((buttonIndex: number) => {
        if (buttonIndex <= this.intakeLabels.length) {
          handler.call(this, labels[buttonIndex - 1]);
        }
      });
    } else {
      const buttons = labels.map(text => {
        return { text, handler: () => handler.call(this, text) } as ActionSheetButton;
      });
      this.actionSheetCtrl.create({
        buttons: [...buttons, { text: 'Cancel', role: 'cancel' }],
      }).present();
    }
  }

  /** Choose week with presentActionSheet. */
  chooseWeek() {
    const date = new DatePipe('en');
    const labels = this.availableWeek.map(d => date.transform(d));
    this.presentActionSheet(labels, (weekStr: string) => {
      const week = this.availableWeek[labels.indexOf(weekStr)];
      if (this.selectedWeek.getDate() !== week.getDate()) {
        this.timetable$.subscribe(tt => this.updateDay(tt, { week }));
      }
    });
  }

  /** Check and update intake on change. */
  changeIntake(intake: string) {
    if (intake !== this.intake) {
      this.settings.set('intake', this.intake = intake);
      this.timetable$.subscribe(tt => this.updateDay(tt));
    }
  }

  /** Check if the day is in week. */
  dayInWeek(date: Date) {
    date.setDate(date.getDate() - date.getDay());
    return date.getFullYear() === this.selectedWeek.getFullYear()
      && date.getMonth() === this.selectedWeek.getMonth()
      && date.getDate() === this.selectedWeek.getDate();
  }

  /** Check if the timetable is outdated. */
  outdated(tt: Timetable[]): boolean {
    const date = new Date(); // first day of week (Sunday)
    date.setDate(date.getDate() - date.getDay());
    return tt.some(t => new Date(t.DATESTAMP_ISO) < date);
  }

  /** Refresh timetable, forcefully if refresher is passed. */
  doRefresh(refresher?) {
    this.timetable$ = this.tt.get(Boolean(refresher)).pipe(
      switchMap(tt => !refresher && this.outdated(tt) ? this.tt.get(true) : of(tt)),
      tap(tt => this.updateDay(tt)),
      tap(tt => this.intakeLabels = Array.from(new Set((tt || []).map(t => t.INTAKE))).sort()),
      finalize(() => refresher && refresher.complete()),
    );
  }

  /** Convert string to color with djb2 hash function. */
  strToColor(str: string): string {
    let hash = 5381;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) + hash) + str.charCodeAt(i); /* hash * 33 + c */
    }
    return '#' + [16, 8, 0].map(i => ('0' + (hash >> i & 0xFF).toString(16))
      .substr(-2)).join('');
  }

  /** Open staff info for lecturer id. */
  openStaffDirectoryInfo(id: string) {
    this.app.getRootNav().push('StaffDirectoryInfoPage', { id });
  }

  /** Track timetable objects. */
  trackByIndex(index: number, item: Timetable): number {
    return index;
  }

  /** Track and update week and date. */
  updateDay(tt: Timetable[], changes: { week?: Date } = {}) {
    // filter by intake (need not to track intake)
    tt = new ClassesPipe().transform(tt, this.intake);

    // get week
    this.availableWeek = Array.from(new Set(tt.map(t => {
      const date = new Date(t.DATESTAMP_ISO);
      date.setDate(date.getDate() - date.getDay());
      return date.valueOf();
    }))).sort().map(d => new Date(d));

    // set default week
    if (!this.selectedWeek || !this.availableWeek.some(d => d.getDate() === this.selectedWeek.getDate())) {
      this.selectedWeek = this.availableWeek[0];
    } else if (changes.week) {
      this.selectedWeek = changes.week;
    } else if (this.availableWeek.length === 0) {
      this.selectedDate = undefined; // rollback displayed date to selected week
      return;
    }

    // get days in week for intake
    this.availableDate = Array.from(new Set(tt
      .filter(t => this.dayInWeek(new Date(t.DATESTAMP_ISO)))
      .map(t => t.DATESTAMP_ISO))).map(d => new Date(d));
    this.availableDays = this.availableDate.map(d => this.wday[d.getDay()]);
    this.content.resize(); // TODO: track changes of day

    // set default day
    if (!this.selectedDate || !this.availableDate.some(d => d.getDay() === this.selectedDate.getDay())) {
      this.selectedDate = this.availableDate[0];
    } else if (this.availableDate.length === 0) {
      this.selectedDate = undefined;
    }
  }

  ionViewDidLoad() {
    // select current day by default
    this.selectedDate = new Date();
    this.selectedDate.setHours(0, 0, 0, 0);

    // select current start of week
    const date = new Date();
    date.setDate(date.getDate() - date.getDay());
    this.selectedWeek = date;

    this.intake = this.settings.get('intake');
    // default intake to student current intake
    if (this.intake === undefined) {
      this.ws.get<StudentProfile[]>('/student/profile').subscribe(p => {
        this.intake = (p[0] || {} as StudentProfile).INTAKE_CODE || '';
        this.settings.set('intake', this.intake);
      });
    }
    this.doRefresh();
  }

  swipe(event) {
    if (event.direction === 2) {
      this.navCtrl.parent.select(2);
    }
    if (event.direction === 4) {
      this.navCtrl.parent.select(0);
    }
  }

}
