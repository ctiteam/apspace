import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { ActionSheetController, IonRefresher } from '@ionic/angular';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { finalize, switchMap, tap } from 'rxjs/operators';
import { LecturerTimetable, StaffProfile } from '../../interfaces';
import { SettingsService, WsApiService } from '../../services';


const chosenOnes = [
  'appsteststaff1', 'abbhirami', 'abubakar_s',
  'haslina.hashim', 'muhammad.danish', 'sireesha.prathi', 'suresh.saminathan',
  'zailan', 'qusay', 'behrang', 'meisam', 'debbie.liew', 'dr.mahmood.bathaee',
  'bawani', 'eizal.afiq',
];

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-lecturer-timetable',
  templateUrl: './lecturer-timetable.page.html',
  styleUrls: ['./lecturer-timetable.page.scss'],
})
export class LecturerTimetablePage implements OnInit {

  printUrl = 'https://api.apiit.edu.my/timetable-print/index.php';

  wday = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

  timetable$: Observable<LecturerTimetable[]>;
  selectedWeek: Date; // week is the first day of week
  availableWeek: Date[] = [];
  selectedDate: Date;
  availableDate: Date[];
  availableDays: string[]; // wday[d.getDay()] for availableDate
  intakeLabels: string[] = [];
  intakeSelectable = true;
  viewWeek: boolean; // weekly or daily display
  show2ndToolbar = false;
  showAttendixFeature = false;
  comingFromTabs = this.router.url.split('/')[1].split('/')[0] === 'tabs';

  room: string;
  intake: string;

  lecturerName: string;
  lecturerCode: string;

  constructor(
    private actionSheetCtrl: ActionSheetController,
    private changeDetectorRef: ChangeDetectorRef,
    private iab: InAppBrowser,
    private router: Router,
    private settings: SettingsService,
    private ws: WsApiService,
  ) { }

  ngOnInit() {
    // select current day by default
    this.selectedDate = new Date();
    this.selectedDate.setHours(0, 0, 0, 0);

    // select current start of week
    const date = new Date();
    date.setDate(date.getDate() - date.getDay() + 1); // monday
    date.setHours(0, 0, 0, 0);
    this.selectedWeek = date;

    // default to daily view
    this.viewWeek = !!this.settings.get('viewWeek');

    this.doRefresh();
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

  /** Check if the day is in week. */
  dayInWeek(date: Date) {
    date.setDate(date.getDate() - (date.getDay() + 6) % 7); // monday
    return date.getFullYear() === this.selectedWeek.getFullYear()
      && date.getMonth() === this.selectedWeek.getMonth()
      && date.getDate() === this.selectedWeek.getDate();
  }

  /** Refresh timetable, forcefully if refresher is passed. */
  doRefresh(refresher?: IonRefresher) {
    this.timetable$ = this.ws.get<StaffProfile[]>('/staff/profile', { caching: 'cache-only' }).pipe(
      tap(profile => {
        this.lecturerName = profile[0].FULLNAME;
        this.lecturerCode = profile[0].CODE;
      }),
      tap(profile => this.showAttendixFeature = chosenOnes.includes(profile[0].ID)),
      switchMap(([{ ID }]) => this.ws.get<LecturerTimetable[]>(`/lecturer-timetable/v2/${ID}`, { auth: false })),
      tap(tt => this.updateDay(tt)),
      finalize(() => refresher && refresher.complete()),
    );
  }

  /** Track timetable objects. */
  trackByIndex(index: number): number {
    return index;
  }

  /** Track and update week and date in the order of day, week, intake. */
  updateDay(tt: LecturerTimetable[]) {
    // get week
    this.availableWeek = Array.from(new Set(tt.map(t => {
      const date = new Date(t.time.slice(0, 10));
      date.setHours(0, 0, 0, 0);
      date.setDate(date.getDate() - (date.getDay() + 6) % 7); // monday
      return date.valueOf();
    }))).sort().map(d => new Date(d));

    // prevent further processing if no week available
    if (this.availableWeek.length === 0) {
      this.selectedDate = undefined; // rollback displayed date to selected week
      return;
    }

    // get days in week for intake
    this.availableDate = Array.from(new Set(tt
      .filter(t => this.dayInWeek(new Date(t.time)))
      .map(t => t.time.slice(0, 10)))).map(d => new Date(d));
    this.availableDays = this.availableDate.map(d => this.wday[(d.getDay() + 6) % 7]); // monday

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

  toggleToolbar() {
    this.show2ndToolbar = !this.show2ndToolbar;
  }

  sendToPrint() {
    const week = moment(this.selectedWeek).format('YYYY-MM-DD'); // week in apspace starts with sunday, API starts with monday
    // tslint:disable-next-line: max-line-length
    this.iab.create(`${this.printUrl}?LectID=${this.lecturerCode}&Submit=Submit&Week=${week}&print_request=print`, '_system', 'location=true');
  }

}
