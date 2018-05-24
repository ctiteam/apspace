import { Component, ViewChild } from '@angular/core';
import { ActionSheet } from '@ionic-native/action-sheet';
import {
  ActionSheetController, ActionSheetButton, Content, IonicPage,
  NavController, Platform
} from 'ionic-angular';

import { Observable } from 'rxjs/Observable';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { distinctUntilChanged, finalize, map, tap } from 'rxjs/operators';

import { StaffDirectory, StudentProfile, Timetable } from '../../interfaces';
import { WsApiProvider } from '../../providers';
import { ClassesPipe } from './classes.pipe';

@IonicPage()
@Component({
  selector: 'page-timetable',
  templateUrl: 'timetable.html',
})
export class TimetablePage {

  wday = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  date: string[] = []; // map wday to date

  timetable$: Observable<Timetable[]>;
  selectedDay: string;
  availableDays: string[];

  @ViewChild(Content) content: Content;

  /* config */
  intake: string = '';

  constructor(
    public actionSheet: ActionSheet,
    public actionSheetCtrl: ActionSheetController,
    public navCtrl: NavController,
    public plt: Platform,
    private ws: WsApiProvider,
  ) { }

  presentActionSheet() {
    this.timetable$.subscribe(tt => {
      let intakes = Array.from(new Set((tt || []).map(t => t.INTAKE))).sort();
      if (this.plt.is('cordova')) {
        const options = {
          buttonLabels: ['My Classes', ...intakes],
          addCancelButtonWithLabel: 'Cancel'
        };
        this.actionSheet.show(options).then((buttonIndex: number) => {
          if (buttonIndex <= 1 + intakes.length) {
            this.intake = intakes[buttonIndex - 2] || '';
            this.timetable$.subscribe(tt => this.updateDay(tt));
          }
        });
      } else {
        let intakesButton = intakes.map(intake => <ActionSheetButton>{
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
            ...intakesButton, { text: 'Cancel', role: 'cancel' }
          ]
        });
        actionSheet.present();
      }
    });
  }

  /** Get days in week of the classes. */
  schoolDays(tt: Timetable[]): string[] {
    let days = new ClassesPipe().transform(tt, this.intake).map(t => t.DAY);
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
    return forkJoin([
      this.ws.get<Timetable[]>('/open/weektimetable', refresh, { auth: false, timeout: 10000 }),
      this.ws.get<StaffDirectory[]>('/staff/listing'),
    ]).pipe(
      distinctUntilChanged(),
      map(data => (data[0] || []).map(t => <Timetable>Object.assign(t,
        { STAFFNAME: ((data[1] || []).find(s => s.CODE === t.LECTID) || <StaffDirectory>{}).FULLNAME }))),
      tap(tt => this.wdayToDate(tt)),
    );
  }

  /** Convert week days into datestamp in timetable. */
  wdayToDate(tt: Timetable[]) {
    this.date = this.wday.map(d => tt.find(t => t.DAY === d).DATESTAMP);
  }

  /** Convert string to color with hashing. */
  strToColor(s: string): string {
    let hash = 0;
    s.split('').forEach(c => hash = c.charCodeAt(0) + ((hash << 5) - hash));
    return '#' + [1, 2, 3].map(i => ('00' + (hash >> (i * 8) & 0xFF).toString(16))
      .substr(-2)).join('');
  }

  doRefresh(refresher?) {
    this.timetable$ = this.getTimetable(Boolean(refresher)).pipe(
      tap(tt => this.updateDay(tt)),
      finalize(() => refresher && refresher.complete()),
    );
  }

  ionViewDidLoad() {
    // select current day by default
    this.selectedDay = this.wday[new Date().getDay()];

    this.ws.get<StudentProfile[]>('/student/profile')
      .subscribe(p => this.intake = p[0].INTAKE_CODE || '');
    this.doRefresh();
  }

}
