import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ActionSheet } from '@ionic-native/action-sheet/ngx';
import {
  ActionSheetController, IonRefresher, ModalController, NavController, Platform,
} from '@ionic/angular';

import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';

import { StudentProfile, StudentTimetable } from '../../interfaces';
import { SettingsService, StudentTimetableService, WsApiService } from '../../services';
import { ClassesPipe } from './classes.pipe';
import { SearchModalComponent } from '../../components/search-modal/search-modal.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-timetable',
  templateUrl: './student-timetable.page.html',
  styleUrls: ['./student-timetable.page.scss'],
})
export class StudentTimetablePage implements OnInit {

  wday = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  legends = [
    {
      name: 'L',
      desc: 'Lecture',
    },
    {
      name: 'T',
      desc: 'Tutorial',
    },
    {
      name: 'T1',
      desc: 'Tutorial Group 1',
    },
    {
      name: 'T2',
      desc: 'Tutorial Group 2',
    },
    {
      name: 'Lab',
      desc: 'Computer Lab',
    },
    {
      name: 'Lab 1',
      desc: 'Computer Lab Group 1',
    },
    {
      name: 'Lab 2',
      desc: 'Computer Lab Group 2',
    },
    {
      name: 'Lab 3',
      desc: 'Computer Lab Group 3',
    },
    {
      name: 'TPM',
      desc: 'APIIT/APLC Campus',
    },
    {
      name: 'New Campus',
      desc: 'APU Campus',
    },
    {
      name: 'B',
      desc: 'Buffer Week',
    },
    {
      name: 'R',
      desc: 'Revision Week',
    },
  ];

  timetable$: Observable<StudentTimetable[]>;
  selectedWeek: Date; // week is the first day of week
  availableWeek: Date[] = [];
  selectedDate: Date;
  availableDate: Date[];
  availableDays: string[]; // wday[d.getDay()] for availableDate
  intakeLabels: string[] = [];
  intakeSelectable = true;
  viewWeek = false; // weekly or daily display

  room: string;
  intake: string;

  constructor(
    private actionSheet: ActionSheet,
    private actionSheetCtrl: ActionSheetController,
    private cdr: ChangeDetectorRef,
    private modalCtrl: ModalController,
    private navCtrl: NavController,
    private plt: Platform,
    private tt: StudentTimetableService,
    private ws: WsApiService,
    private settings: SettingsService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    // select current day by default
    this.selectedDate = new Date();
    this.selectedDate.setHours(0, 0, 0, 0);

    // select current start of week
    const date = new Date();
    date.setDate(date.getDate() - date.getDay());
    this.selectedWeek = date;

    // optional room paramMap to filter timetables by room (separated from intake filter)
    this.room = this.route.snapshot.paramMap.get('room');

    // optional intake passed by other pages
    const intake = this.route.snapshot.params.intake;
    if (intake || this.room) { // indirect timetable page access
      this.intakeSelectable = false;
    }

    // quick exit when room is specified (and do not set intake)
    if (this.room !== null) {
      return this.doRefresh();
    }

    // intake from params -> intake from settings -> student default intake
    this.intake = intake || this.settings.get('intake');

    // default intake to student current intake
    if (this.intake === undefined) {
      this.ws.get<StudentProfile>('/student/profile').subscribe(p => {
        this.intake = (p || {} as StudentProfile).INTAKE || '';
        this.settings.set('intake', this.intake);
      });
    }

    this.doRefresh();
  }

  presentActionSheet(labels: string[], handler: (_: string) => void) {
    if (this.plt.is('cordova') && !this.plt.is('ios')) {
      const options = {
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
      }).then(actionSheet => actionSheet.present());
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
        this.cdr.markForCheck();
        this.timetable$.subscribe();
      }
    });
  }

  /** Check and update intake on change. */
  changeIntake(intake: string) {
    if (intake !== null && intake !== this.intake) {
      this.settings.set('intake', this.intake = intake);
      this.cdr.markForCheck();
      this.timetable$.subscribe();
    }
  }

  /** Display intake search modal. */
  async presentIntakeSearch() {
    const modal = await this.modalCtrl.create({
      component: SearchModalComponent,
      // TODO: store search history
      componentProps: { items: this.intakeLabels, notFound: 'No Intake Selected' },
    });
    await modal.present();
    // default item to current intake if model dismissed without data
    const { data: { item: intake } = { item: this.intake } } = await modal.onDidDismiss();
    this.changeIntake(intake);
  }

  /** Check if the day is in week. */
  dayInWeek(date: Date) {
    date.setDate(date.getDate() - date.getDay());
    return date.getFullYear() === this.selectedWeek.getFullYear()
      && date.getMonth() === this.selectedWeek.getMonth()
      && date.getDate() === this.selectedWeek.getDate();
  }

  /** Refresh timetable, forcefully if refresher is passed. */
  doRefresh(refresher?: IonRefresher) {
    this.timetable$ = this.tt.get(Boolean(refresher)).pipe(
      tap(tt => this.updateDay(tt)),
      // initialize or update intake labels only if timetable might change
      tap(tt => (Boolean(refresher) || this.intakeLabels.length === 0)
        && (this.intakeLabels = Array.from(new Set((tt || []).map(t => t.INTAKE))).sort())),
      finalize(() => refresher && refresher.complete()),
    );
  }

  /** Convert string to color with djb2 hash function. */
  strToColor(str: string): string {
    let hash = 5381;
    /* tslint:disable:no-bitwise */
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) + hash) + str.charCodeAt(i); /* hash * 33 + c */
    }
    return '#' + [16, 8, 0].map(i => ('0' + (hash >> i & 0xFF).toString(16))
      .substr(-2)).join('');
    /* tslint:enable:no-bitwise */
  }

  /** Track timetable objects. */
  trackByIndex(index: number, item: StudentTimetable): number {
    return index;
  }

  /** Track and update week and date in the order of day, week, intake. */
  updateDay(tt: StudentTimetable[]) {
    // filter by intake and room (need not to track intake)
    // XXX: remove this so that classes pipe is only called once
    tt = new ClassesPipe().transform(tt, this.intake, this.room);

    // get week
    this.availableWeek = Array.from(new Set(tt.map(t => {
      const date = new Date(t.DATESTAMP_ISO);
      date.setDate(date.getDate() - date.getDay());
      return date.valueOf();
    }))).sort().map(d => new Date(d));

    // prevent further processing if no week available
    if (this.availableWeek.length === 0) {
      this.selectedDate = undefined; // rollback displayed date to selected week
      return;
    }

    // get days in week for intake
    this.availableDate = Array.from(new Set(tt
      .filter(t => this.dayInWeek(new Date(t.DATESTAMP_ISO)))
      .map(t => t.DATESTAMP_ISO))).map(d => new Date(d));
    this.availableDays = this.availableDate.map(d => this.wday[d.getDay()]);

    // set default day
    if (!this.selectedDate || !this.availableDate.some(d => d.getDay() === this.selectedDate.getDay())) {
      this.selectedDate = this.availableDate[0];
    } else if (!this.availableDate.some(d => d.getDate() === this.selectedDate.getDate())) {
      this.selectedDate = this.availableDate.find(d => d.getDay() === this.selectedDate.getDay());
    } else if (this.availableDate.length === 0) {
      this.selectedDate = undefined;
    }
  }

}
