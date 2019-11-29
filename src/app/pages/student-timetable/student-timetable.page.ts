import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { ActionSheetController, IonRefresher, ModalController } from '@ionic/angular';
import * as moment from 'moment';
import { Observable, combineLatest } from 'rxjs';
import { finalize, map, tap } from 'rxjs/operators';

import { SearchModalComponent } from '../../components/search-modal/search-modal.component';
import { Role, StudentProfile, StudentTimetable } from '../../interfaces';
import { SettingsService, StudentTimetableService, UserSettingsService, WsApiService } from '../../services';
import { ClassesPipe } from './classes.pipe';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-timetable',
  templateUrl: './student-timetable.page.html',
  styleUrls: ['./student-timetable.page.scss'],
})
export class StudentTimetablePage implements OnInit {

  printUrl = 'https://api.apiit.edu.my/timetable-print/index.php';
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

  comingFromTabs = this.router.url.split('/')[1].split('/')[0] === 'tabs';

  timetable$: Observable<StudentTimetable[]>;
  selectedWeek: Date; // week is the first day of week
  availableWeek: Date[] = [];
  selectedDate: Date;
  availableDate: Date[];
  availableDays: string[]; // wday[d.getDay()] for availableDate
  intakeLabels: string[] = [];
  intakeSelectable = true;
  viewWeek: boolean; // weekly or daily display
  show2ndToolbar = false;

  room: string;
  intake: string;
  freeTime = false;

  constructor(
    private actionSheetCtrl: ActionSheetController,
    private changeDetectorRef: ChangeDetectorRef,
    private iab: InAppBrowser,
    private modalCtrl: ModalController,
    private route: ActivatedRoute,
    private router: Router,
    private settings: SettingsService,
    private tt: StudentTimetableService,
    private userSettings: UserSettingsService,
    private ws: WsApiService,
  ) { }

  ngOnInit() {
    // select current day by default
    this.selectedDate = new Date();
    this.selectedDate.setHours(0, 0, 0, 0);

    // select current start of week
    const date = new Date();
    if (date.getDay() !== 6) { // 6 is saturday
      date.setDate(date.getDate() - date.getDay());
    } else {
      date.setDate(date.getDate() + 1);  // include saturdays with the new week
    }
    this.selectedWeek = date;

    // optional room paramMap to filter timetables by room (separated from intake filter)
    this.room = this.route.snapshot.paramMap.get('room');

    // optional intake passed by other pages
    const intake = this.route.snapshot.params.intake;
    if (this.room) { // indirect timetable page access
      this.intakeSelectable = false;
      this.freeTime = true;
    }

    // quick exit when room is specified (and do not set intake)
    if (this.room !== null) {
      return this.doRefresh();
    }

    // intake from params -> intake from settings -> student default intake
    const intakeHistory = this.settings.get('intakeHistory') || [];
    this.intake = intake || intakeHistory[intakeHistory.length - 1];

    // default to daily view
    this.viewWeek = !!this.settings.get('viewWeek');

    // default intake to student current intake
    if (this.intake === undefined) {
      // tslint:disable-next-line: no-bitwise
      if (this.settings.get('role') & Role.Student) { // intake is not defined & user role is student
        this.ws.get<StudentProfile>('/student/profile', { caching: 'cache-only' }).subscribe(p => {
          this.intake = (p || {} as StudentProfile).INTAKE || '';
          this.changeDetectorRef.markForCheck();
          this.settings.set('intakeHistory', [this.intake]);
          this.doRefresh();
        });
      } else {
        // intake is not defined & user role is staff or lecturers
        this.doRefresh();
      }
    } else { // intake is defined
      this.doRefresh();
    }
  }

  presentActionSheet(labels: string[], handler: (_: string) => void) {
    const buttons = labels.map(text => ({ text, handler: () => handler.call(this, text) }));
    this.actionSheetCtrl.create({
      buttons: [...buttons, { text: 'Cancel', role: 'cancel' }],
    }).then(actionSheet => actionSheet.present());
  }

  /** Switch between daily and weekly view and save. */
  rotateView() {
    this.settings.set('viewWeek', this.viewWeek = !this.viewWeek);
  }

  /** Choose week with presentActionSheet. */
  chooseWeek() {
    const date = new DatePipe('en');
    const labels = this.availableWeek.map(d => date.transform(d));
    this.presentActionSheet(labels, (weekStr: string) => {
      const week = this.availableWeek[labels.indexOf(weekStr)];
      if (this.selectedWeek.getDate() !== week.getDate()) {
        this.selectedWeek = week;
        this.changeDetectorRef.markForCheck();
        this.timetable$.subscribe();
      }
    });
  }

  /** Check and update intake on change. */
  changeIntake(intake: string) {
    if (intake !== null && intake !== this.intake) {
      this.intake = intake;
      // tslint:disable-next-line: no-bitwise
      if (this.settings.get('role') & Role.Student) {
        this.settings.set('intakeHistory', this.settings.get('intakeHistory')
          .concat(intake)
          .filter((v, i, a) => a.lastIndexOf(v) === i)
          .slice(-5));
      }
      this.changeDetectorRef.markForCheck();
      this.timetable$.subscribe();
    }
  }

  /** Display intake search modal. */
  async presentIntakeSearch() {
    const modal = await this.modalCtrl.create({
      component: SearchModalComponent,
      componentProps: {
        items: this.intakeLabels,
        defaultItems: this.settings.get('intakeHistory'),
        notFound: 'No intake selected'
      }
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
    const timetable$ = this.tt.get(Boolean(refresher)).pipe(
      finalize(() => refresher && refresher.complete())
    );
    this.timetable$ = combineLatest([timetable$, this.userSettings.timetable.asObservable()]).pipe(
      map(([tt, { blacklists }]) => blacklists ? tt.filter(t => !blacklists.includes(t.MODID)) : tt),
      tap(tt => this.updateDay(tt)),
      // initialize or update intake labels only if timetable might change
      tap(tt => (Boolean(refresher) || this.intakeLabels.length === 0)
        && (this.intakeLabels = Array.from(new Set((tt || []).map(t => t.INTAKE))).sort())),
    );
  }

  /** Track timetable objects. */
  trackByIndex(index: number): number {
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
    if (this.availableDate.length === 0) {
      this.selectedDate = undefined;
    } else if (!this.selectedDate || !this.availableDate.find(d => d.getDay() === this.selectedDate.getDay())) {
      const date = new Date();
      const today = this.availableDate.find(d => d.getDate() === date.getDate());
      this.selectedDate = today || this.availableDate[0];
    } else if (!this.availableDate.some(d => d.getDate() === this.selectedDate.getDate())) {
      this.selectedDate = this.availableDate.find(d => d.getDay() === this.selectedDate.getDay());
    }

    this.changeDetectorRef.markForCheck();
  }

  view_hideToolbar() {
    this.show2ndToolbar = !this.show2ndToolbar;
  }

  sendToPrint() {
    const week = moment(this.selectedWeek).add(1, 'day').format('YYYY-MM-DD'); // week in apspace starts with sunday, API starts with monday
    // For student timetable:
    // printUrl?Week=2019-11-18&Intake=APTDF1805DSM(VFX)&print_request=print_tt
    // For lecturer timetable:
    // printUrl?LectID=ARW&Submit=Submit&Week=2019-11-18&print_request=print
    this.iab.create(`${this.printUrl}?Week=${week}&Intake=${this.intake}&print_request=print_tt`, '_system', 'location=true');
  }

}
