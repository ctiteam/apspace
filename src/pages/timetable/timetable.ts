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
  date: string[] = []; // map wday to date

  timetable$: Observable<Timetable[]>;
  selectedDay: string;
  availableDays: string[];
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

  presentActionSheet() {
    if (this.plt.is('cordova') && !this.plt.is('ios')) {
      const options: ActionSheetOptions = {
        buttonLabels: this.intakeLabels,
        addCancelButtonWithLabel: 'Cancel',
      };
      this.actionSheet.show(options).then((buttonIndex: number) => {
        if (buttonIndex <= this.intakeLabels.length) {
          this.changeIntake(this.intakeLabels[buttonIndex - 1] || '');
        }
      });
    } else {
      const intakesButton = this.intakeLabels.map(intake => {
        return { text: intake, handler: () => this.changeIntake(intake) } as ActionSheetButton;
      });
      this.actionSheetCtrl.create({
        buttons: [...intakesButton, { text: 'Cancel', role: 'cancel' }],
      }).present();
    }
  }

  /** Check and update intake on change. */
  changeIntake(intake: string) {
    if (intake !== this.intake) {
      this.settings.set('intake', this.intake = intake);
      this.timetable$.subscribe(tt => this.updateDay(tt));
    }
  }

  /** Get days in week of the classes. */
  schoolDays(tt: Timetable[]): string[] {
    const days = new ClassesPipe().transform(tt, this.intake).map(t => t.DAY);
    return this.wday.filter(d => days.indexOf(d) !== -1);
  }

  /** Update selected day in segment and style when day change. */
  updateDay(tt: Timetable[]): void {
    this.availableDays = this.schoolDays(tt);
    if (!this.selectedDay || this.availableDays.indexOf(this.selectedDay) === -1) {
      this.selectedDay = this.availableDays[0];
    } else if (!this.availableDays.length) {
      this.selectedDay = undefined;
    }
    this.content.resize();
  }

  /** Check if the timetable is outdated. */
  outdated(tt: Timetable[]): boolean {
    const date = new Date(); // first day of week (Sunday)
    date.setDate(date.getDate() - date.getDay());
    return new Date(tt[0].DATESTAMP_ISO) < date;
  }

  /** Refresh timetable, forcefully if refresher is passed. */
  doRefresh(refresher?) {
    this.timetable$ = this.getTimetable(Boolean(refresher)).pipe(
      switchMap(tt => !refresher && this.outdated(tt) ? this.getTimetable(true) : of(tt)),
      tap(tt => this.updateDay(tt)),
      tap(tt => this.intakeLabels = Array.from(new Set((tt || []).map(t => t.INTAKE))).sort()),
      finalize(() => refresher && refresher.complete()),
    );
  }

  /** Convert week days into datestamp in timetable. */
  wdayToDate(tt: Timetable[]) {
    this.date = this.wday.map(d => (tt.find(t => t.DAY === d) || {} as Timetable).DATESTAMP_ISO);
  }

  /** Get and process Timetable. */
  getTimetable(refresh: boolean = false): Observable<Timetable[]> {
    return this.tt.get(refresh).pipe(
      tap(tt => this.wdayToDate(tt)),
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

  ionViewDidLoad() {
    // select current day by default
    this.selectedDay = this.wday[new Date().getDay()];

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
