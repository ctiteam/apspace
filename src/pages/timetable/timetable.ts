import { Observable } from 'rxjs/Observable';
import { Component, ViewChild } from '@angular/core';
import { ActionSheet } from '@ionic-native/action-sheet';
import { ActionSheetController, ActionSheetButton, Content, IonicPage,
  NavController, Platform } from 'ionic-angular';

import { StaffDirectory } from '../../interfaces/staff-directory';
import { Timetable } from '../../interfaces/timetable';
import { WsApiProvider } from '../../providers/ws-api/ws-api';

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
          buttonLabels: [ 'My Classes', ...intakes ],
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

  /** Get all classes for student. */
  classes(tt: Timetable[]): Timetable[] {
    if (!Array.isArray(tt)) {
      return [] as Timetable[];
    } else if (!this.intake) {
      return [] as Timetable[]; /* TODO: My Classes */
    } else {
      return this.intake ? tt.filter(t => this.intake === t.INTAKE) : tt;
    }
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
    return Observable.forkJoin([
      this.ws.get<Timetable[]>('/open/weektimetable', refresh, { auth: false, timeout: 10000 }),
      this.ws.get<StaffDirectory[]>('/staff/listing'),
    ]).map(data => data[0].map(t => <Timetable>Object.assign(t, { STAFFNAME:
      ((data[1] || []).find(s => s.CODE === t.LECTID) || <StaffDirectory>{}).FULLNAME })));
  }

  strToColor(s: string): string {
    let hash = 0;
    s.split('').forEach(c => hash = c.charCodeAt(0) + ((hash << 5) - hash));
    return '#' + [1,2,3].map(i => ('00' + (hash >> (i * 8) & 0xFF).toString(16))
                                  .substr(-2)).join('');
  }

  doRefresh(refresher?) {
    this.timetable$ = this.getTimetable(Boolean(refresher))
      .do(tt => this.updateDay(tt))
      .finally(() => refresher && refresher.complete());
  }

  ionViewDidLoad() {
<<<<<<< ab061e9b62600668278d28f2360a940aabc79cb4
    this.doRefresh();
=======
    this.refresher.progress = 1; /* Never display the no classes card on load */
    this.doRefresh(false);
    //this.ws.get('/student/photo').subscribe(d => console.log("from tibleble:  "+d));
>>>>>>> renamed needed files and scode to proper names
  }

}
