import { DatePipe } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { ActionSheet, ActionSheetOptions } from '@ionic-native/action-sheet';
import {
  ActionSheetButton, ActionSheetController, App, Content, IonicPage,
  ModalController, NavController, Platform, MenuController, ViewController,
} from 'ionic-angular';

import { Observable } from 'rxjs/Observable';
import { finalize, switchMap, tap, debounceTime, distinctUntilChanged, map, share } from 'rxjs/operators';

import { Role, StudentProfile, Timetable } from '../../interfaces';
import {
  SettingsProvider, TimetableProvider, WsApiProvider,
} from '../../providers';
import { ClassesPipe } from './classes.pipe';
import { FormControl } from '@angular/forms';

@IonicPage()
@Component({
  selector: 'page-timetable',
  templateUrl: 'timetable.html',
})
export class TimetablePage {

  wday = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  
  searchControl = new FormControl();
  searchIntake$: Observable<string[]>;
  timetable$: Observable<Timetable[]>;
  selectedWeek: Date; // week is the first day of week
  availableWeek: Date[];
  selectedDate: Date;
  availableDate: Date[];
  availableDays: string[]; // wday[d.getDay()] for availableDate
  intakeLabels: string[] = [];
  numOfSkeletons = new Array(5);


  @ViewChild(Content) content: Content;

  /* config */
  intake: string;

  constructor(
    public actionSheet: ActionSheet,
    public actionSheetCtrl: ActionSheetController,
    public modalCtrl: ModalController,
    public navCtrl: NavController,
    public plt: Platform,
    private tt: TimetableProvider,
    private ws: WsApiProvider,
    private settings: SettingsProvider,
    public menu: MenuController,
    public app: App,
    public viewCtrl: ViewController
  ) { }

  presentActionSheet(labels: string[], handler: (_: string) => void) {
    if (this.plt.is('cordova') && !this.plt.is('ios')) {
      const options: ActionSheetOptions = {
        buttonLabels: labels,
        addCancelButtonWithLabel: 'Cancel',
      };
      this.actionSheet.show(options).then((buttonIndex: number) => {
        if (buttonIndex <= labels.length) {
          handler.call(this, labels[buttonIndex - 1]);
        }
      });
    } else {
      const buttons = labels.map(text => ({ text, handler: () => handler.call(this, text) }));
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
        this.selectedWeek = week;
        this.timetable$.subscribe();
      }
    });
  }

  // TOGGLE THE MENU
  toggleFilterMenu() {
    this.menu.toggle();
  }

  /** Check and update intake on change. */
  changeIntake(intake: string) {
    if (intake !== this.intake) {
      this.settings.set('intake', this.intake = intake);
      this.timetable$.subscribe();
    }
  }

  /** Display intake search modal. */
  // presentIntakeSearch() {
  //   const intakeSearchModal = this.modalCtrl.create('IntakeSearchPage');
  //   intakeSearchModal.onDidDismiss(data => data && this.changeIntake(data.intake));
  //   intakeSearchModal.present();
  // }

  /** Check if the day is in week. */
  dayInWeek(date: Date) {
    date.setDate(date.getDate() - date.getDay() + 1);
    return date.getFullYear() === this.selectedWeek.getFullYear()
      && date.getMonth() === this.selectedWeek.getMonth()
      && date.getDate() === this.selectedWeek.getDate();
  }

  /** Refresh timetable, forcefully if refresher is passed. */
  doRefresh(refresher?) {
    this.timetable$ = this.tt.get(Boolean(refresher)).pipe(
      tap(tt => this.updateDay(tt)),
      // initialize or update intake labels only if timetable might change
      tap(tt => (Boolean(refresher) || this.intakeLabels.length === 0)      
      && (this.intakeLabels = Array.from(new Set((tt || []).map(t => t.INTAKE))).sort())),
      finalize(() => refresher && refresher.complete()),
    );
  }

  getTimetableData(){
    return this.timetable$ = this.tt.get().pipe(
      tap(tt => this.updateDay(tt)),
      tap(tt => (this.intakeLabels.length === 0)      
      && (this.intakeLabels = Array.from(new Set((tt || []).map(t => t.INTAKE))).sort())),
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

  /** Track and update week and date in the order of day, week, intake. */
  updateDay(tt: Timetable[]) {
    // filter by intake (need not to track intake)
    tt = new ClassesPipe().transform(tt, this.intake);

    // get week
    this.availableWeek = Array.from(new Set(tt.map(t => {
      const date = new Date(t.DATESTAMP_ISO);
      date.setDate(date.getDate() - date.getDay() + 1);
      return date.valueOf();
    }))).sort().map(d => new Date(d));

    // set default week
    if (!this.selectedWeek || !this.availableWeek.some(d => d.getDate() === this.selectedWeek.getDate())) {
      this.selectedWeek = this.availableWeek[0];
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
    } else if (!this.availableDate.some(d => d.getDate() === this.selectedDate.getDate())) {
      this.selectedDate = this.availableDate.find(d => d.getDay() === this.selectedDate.getDay());
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
    date.setDate(date.getDate() - date.getDay() + 1);
    this.selectedWeek = date;
    this.intake = this.settings.get('intake');
    this.getTimetableData().subscribe(
      _ => { },
      _ => { },
      () => {
        // default intake to student current intake
        if (this.intake === undefined && this.settings.get('role') & Role.Student) {
          this.ws.get<StudentProfile>('/student/profile').subscribe(p => {
            for (let intake of this.intakeLabels) {
              if (intake === (p || {} as StudentProfile).INTAKE) {
                this.intake = (p || {} as StudentProfile).INTAKE || '';
                this.settings.set('intake', this.intake);
                this.doRefresh();
              }
            }
          });
        }
      }
    );


    const intake$ = this.tt.get().pipe(
      map(tt => Array.from(new Set((tt || []).map(t => t.INTAKE.toUpperCase()))).sort()),
      share(),
    );

    this.searchIntake$ = this.searchControl.valueChanges.pipe(
      debounceTime(250),
      distinctUntilChanged(),
      // tap(() => this.searching = true),
      map(term => term.toUpperCase()),
      switchMap(term => intake$.pipe(
        // start filter on input but accept empty input too
        map(intakes => term.length !== 0
          ? intakes.filter(intake => intake.indexOf(term) !== -1)
          : intakes),
        // auto-select if there is only one intake left
        tap(intakes => intakes.length === 1 && this.select(intakes[0])),
      )),
      // tap(() => this.searching = false),
    )
  }

  select(intake: string) {
    this.changeIntake(intake);
    this.toggleFilterMenu();
  }
}
