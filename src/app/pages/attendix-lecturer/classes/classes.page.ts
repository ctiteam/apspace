import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AlertController, IonSelect, LoadingController, ModalController, ToastController
} from '@ionic/angular';

import { Observable, forkJoin } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

import { SearchModalComponent } from '../../../components/search-modal/search-modal.component';
import { Classcode, StaffProfile, StudentTimetable } from '../../../interfaces';
import { SettingsService, StudentTimetableService, WsApiService } from '../../../services';
import { between, isoDate, parseTime } from '../date';

type Schedule = Pick<Classcode, 'CLASS_CODE'>
  & Pick<StudentTimetable, 'DATESTAMP_ISO' | 'TIME_FROM' | 'TIME_TO'>
  & { TYPE: string; };

@Component({
  selector: 'app-classes',
  templateUrl: './classes.page.html',
  styleUrls: ['./classes.page.scss']
})
export class ClassesPage implements AfterViewInit, OnInit {

  auto = true; // manual mode to record mismatched data

  timetablesprofile$: Observable<[StaffProfile[], StudentTimetable[]]>;

  timings = [
    '08:00 AM', '08:05 AM', '08:10 AM', '08:15 AM', '08:20 AM', '08:25 AM',
    '08:30 AM', '08:35 AM', '08:40 AM', '08:45 AM', '08:50 AM', '08:55 AM',
    '09:00 AM', '09:05 AM', '09:10 AM', '09:15 AM', '09:20 AM', '09:25 AM',
    '09:30 AM', '09:35 AM', '09:40 AM', '09:45 AM', '09:50 AM', '09:55 AM',
    '10:00 AM', '10:05 AM', '10:10 AM', '10:15 AM', '10:20 AM', '10:25 AM',
    '10:30 AM', '10:35 AM', '10:40 AM', '10:45 AM', '10:50 AM', '10:55 AM',
    '11:00 AM', '11:05 AM', '11:10 AM', '11:15 AM', '11:20 AM', '11:25 AM',
    '11:30 AM', '11:35 AM', '11:40 AM', '11:45 AM', '11:50 AM', '11:55 AM',
    '12:00 PM', '12:05 PM', '12:10 PM', '12:15 PM', '12:20 PM', '12:25 PM',
    '12:30 PM', '12:35 PM', '12:40 PM', '12:45 PM', '12:50 PM', '12:55 PM',
    '01:00 PM', '01:05 PM', '01:10 PM', '01:15 PM', '01:20 PM', '01:25 PM',
    '01:30 PM', '01:35 PM', '01:40 PM', '01:45 PM', '01:50 PM', '01:55 PM',
    '02:00 PM', '02:05 PM', '02:10 PM', '02:15 PM', '02:20 PM', '02:25 PM',
    '02:30 PM', '02:35 PM', '02:40 PM', '02:45 PM', '02:50 PM', '02:55 PM',
    '03:00 PM', '03:05 PM', '03:10 PM', '03:15 PM', '03:20 PM', '03:25 PM',
    '03:30 PM', '03:35 PM', '03:40 PM', '03:45 PM', '03:50 PM', '03:55 PM',
    '04:00 PM', '04:05 PM', '04:10 PM', '04:15 PM', '04:20 PM', '04:25 PM',
    '04:30 PM', '04:35 PM', '04:40 PM', '04:45 PM', '04:50 PM', '04:55 PM',
    '05:00 PM', '05:05 PM', '05:10 PM', '05:15 PM', '05:20 PM', '05:25 PM',
    '05:30 PM', '05:35 PM', '05:40 PM', '05:45 PM', '05:50 PM', '05:55 PM',
    '06:00 PM', '06:05 PM', '06:10 PM', '06:15 PM', '06:20 PM', '06:25 PM',
    '06:30 PM', '06:35 PM', '06:40 PM', '06:45 PM', '06:50 PM', '06:55 PM',
    '07:00 PM', '07:05 PM', '07:10 PM', '07:15 PM', '07:20 PM', '07:25 PM',
    '07:30 PM', '07:35 PM', '07:40 PM', '07:45 PM', '07:50 PM', '07:55 PM',
    '08:00 PM', '08:05 PM', '08:10 PM', '08:15 PM', '08:20 PM', '08:25 PM',
    '08:30 PM', '08:35 PM', '08:40 PM', '08:45 PM', '08:50 PM', '08:55 PM',
    '09:00 PM', '09:05 PM', '09:10 PM', '09:15 PM', '09:20 PM', '09:25 PM',
    '09:30 PM', '09:35 PM', '09:40 PM', '09:45 PM', '09:50 PM', '09:55 PM',
    '10:00 PM', '10:05 PM', '10:10 PM', '10:15 PM', '10:20 PM', '10:25 PM',
    '10:30 PM', '10:35 PM', '10:40 PM', '10:45 PM', '10:50 PM', '10:55 PM',
    '11:00 PM', '11:05 PM', '11:10 PM', '11:15 PM', '11:20 PM', '11:25 PM',
    '11:30 PM', '11:35 PM', '11:40 PM', '11:45 PM', '11:50 PM', '11:55 PM'];

  /* computed */
  classcodes: string[];
  schedules: Schedule[];
  schedulesByClasscode: Schedule[];
  schedulesByClasscodeDate: Schedule[];

  dates: string[];
  startTimes: string[];
  endTimes: string[];
  classTypes = ['Lecture', 'Tutorial', 'Lab'];

  /* selected */
  classcode: string;
  date: string; // 2020-12-31
  startTime: string;
  endTime: string;
  classType: string;

  /* manual */
  manualClasscodes: string[];
  manualDates: string[];
  manualStartTimes: string[];
  manualEndTimes: string[];

  manualClasscode: string;
  manualDate: string;
  manualStartTime: string;
  manualEndTime: string;
  manualClassType: string;

  @ViewChild('classcodeInput') classcodeInput: IonSelect;

  constructor(
    private tt: StudentTimetableService,
    private ws: WsApiService,
    private route: ActivatedRoute,
    private router: Router,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public modalCtrl: ModalController,
    public settings: SettingsService,
    public toastCtrl: ToastController,
  ) { }

  ngOnInit() {
    const profile$ = this.ws.get<StaffProfile[]>('/staff/profile', { caching: 'cache-only' });
    this.timetablesprofile$ = forkJoin([profile$, this.tt.get()]).pipe(
      shareReplay(1), // no need to refresh rigid data when user came back
    );
  }

  ionViewDidEnter() {
    const loadingCtrl = this.loadingCtrl.create({
      spinner: 'dots',
      duration: 5000,
      message: 'Please wait...',
      translucent: true,
    });
    loadingCtrl.then(loading => loading.present());

    const d = new Date();
    const date = isoDate(d);
    const nowMins = d.getHours() * 60 + d.getMinutes();

    const classcodes$ = this.ws.get<Classcode[]>('/attendix/classcodes');

    // get self timetable but filter out future classes
    const timetables$ = this.timetablesprofile$.pipe(
      map(([profile, timetables]) => timetables.filter(timetable =>
        profile[0].ID === timetable.SAMACCOUNTNAME
        && (timetable.DATESTAMP_ISO !== date
          || parseTime(timetable.TIME_FROM) <= nowMins))),
    );

    forkJoin([timetables$, classcodes$]).subscribe(([timetables, classcodes]) => {
      // left join on classcodes
      const joined = timetables.map(timetable => ({
        ...(
          classcodes.find(classcode => {
            // Classcode BM006-3-2-CRI-L-UC2F1805CGD-CS-DA-IS-IT-BIS-CC-DBA-ISS-MBT-NC-MMT-SE-HLH
            // Take only BM006-3-2-CRI-L- (+3 extra characters with '-' pad for L, T1, T2)
            // Timetable BM006-3-2-CRI-L (or T-1 or T-2, need to strip the '-')
            const len = classcode.SUBJECT_CODE.length;
            return classcode.CLASS_CODE.slice(0, len + 3) ===
              (timetable.MODID.replace(/-([TL])-(\d)$/, '-$1$2') + '-').slice(0, len + 3)
              && classcode.COURSE_CODE_ALIAS === timetable.INTAKE;
          }) // fallback without checking the class type (-L)
          || classcodes.find(classcode => {
            // Classcode MPU3272-WPCS-UC2F1910SOE-SOT-SOMM-SUH
            // Take only MPU3272-WPCS
            // Timetable MPU3272-WPCS-T
            const len = classcode.SUBJECT_CODE.length;
            return classcode.CLASS_CODE.slice(0, len) === timetable.MODID.slice(0, len)
              && classcode.COURSE_CODE_ALIAS === timetable.INTAKE;
          })
        ),
        ...timetable
      }));

      // lay out base schedules for guessing
      this.schedules = joined.map(data => {
        let guessClassType: string | null;
        if (data.SUBJECT_CODE) {
          const len = data.SUBJECT_CODE.length;
          if (data.CLASS_CODE[len + 1] === 'T') {
            guessClassType = 'Tutorial';
          } else if (data.CLASS_CODE[len + 2] === 'A') {
            guessClassType = 'Lab';
          } else if (data.CLASS_CODE[len + 1] === 'L') {
            guessClassType = 'Lecture';
          }
        }
        return {
          CLASS_CODE: data.CLASS_CODE,
          DATESTAMP_ISO: data.DATESTAMP_ISO,
          TIME_FROM: data.TIME_FROM,
          TIME_TO: data.TIME_TO,
          TYPE: guessClassType,
        };
      });
      this.guessWork(joined, date, nowMins);

      // append existing timetable after guess work
      const mapped = classcodes.map(({ CLASS_CODE, CLASSES }) =>
        CLASSES.map(({ DATE, TIME_FROM, TIME_TO, TYPE }) =>
          ({ DATESTAMP_ISO: DATE, TIME_FROM, TIME_TO, CLASS_CODE, TYPE })));
      this.schedules = this.schedules.concat.apply([], mapped);
      this.classcodes = [...new Set(this.schedules.map(schedule => schedule.CLASS_CODE).filter(Boolean))].sort();

      this.fillManualInputs(classcodes);

      // console.log('filtered', this.schedules, this.classcodes);
      loadingCtrl.then(loading => loading.dismiss());
    });
  }

  ngAfterViewInit() {
    // prevent ion-select click bubbling
    (this.classcodeInput as any).el.addEventListener('click', (ev: MouseEvent) => {
      ev.stopPropagation();
      this.chooseClasscode();
    }, true);
  }

  /** Guess the current classcode based on timetable. */
  guessWork(schedules: (Classcode & StudentTimetable)[], date: string, nowMins: number) {
    const guessSchedules = schedules.filter(schedule => {
      return schedule.DATESTAMP_ISO === date
        && schedule.CLASS_CODE // CLASS_CODE may not be matched
        && between(schedule.TIME_FROM, schedule.TIME_TO, nowMins);
    });

    if (new Set(guessSchedules.map(schedule => schedule.MODID)).size !== 1) {
      this.toastCtrl.create({
        message: 'Fail to auto complete, switched to \'Manual\' mode',
        duration: 3000,
        position: 'top',
        color: 'warning',
        buttons: [
          {
            text: 'Close',
            role: 'cancel'
          }
        ],
      }).then(toast => toast.present());
      this.auto = false;
      console.warn('fail to auto complete', guessSchedules);
      return;
    }
    const currentSchedule = guessSchedules[0];

    // set inputs only if all are found
    this.changeClasscode(this.classcode = currentSchedule.CLASS_CODE, false);
    this.changeDate(this.date = date, false);
    this.changeStartTime(this.startTime = currentSchedule.TIME_FROM);
    // console.log('currentSchedule', currentSchedule);
  }

  /** Display search modal to choose classcode. */
  async chooseClasscode() {
    const modal = await this.modalCtrl.create({
      component: SearchModalComponent,
      componentProps: {
        items: this.auto ? this.classcodes : this.manualClasscodes,
        defaultItems: this.auto ? this.classcodes : this.manualClasscodes,
        notFound: 'No classcode selected'
      }
    });
    await modal.present();
    const { data: { item: classcode } = { item: this.classcode } } = await modal.onDidDismiss();
    if (this.auto) {
      if (classcode !== null && classcode !== this.classcode) {
        this.changeClasscode(this.classcode = classcode);
      }
    } else {
      this.manualClasscode = classcode;
    }
  }

  /** Fill manual inputs. */
  fillManualInputs(classcodes: Classcode[]) {
    this.manualClasscodes = [...new Set(classcodes.map(classcode => classcode.CLASS_CODE))];
    this.manualDates = [...Array(30).keys()]
      .map(n => isoDate(new Date(new Date().setDate(new Date().getDate() - n))));
  }

  /** Change classcode, auto select class type. */
  changeClasscode(classcode: string, propagate = true) {
    this.schedulesByClasscode = this.schedules.filter(schedule => schedule.CLASS_CODE === classcode);
    this.dates = [...new Set(this.schedulesByClasscode.map(schedule => schedule.DATESTAMP_ISO))].sort().reverse();
    this.date = '';

    if (propagate && this.dates.length === 1) {
      this.changeDate(this.date = this.dates[0]);
    }
  }

  /** Change date. */
  changeDate(date: string, propagate = true) {
    if (this.auto) {
      this.schedulesByClasscodeDate = this.schedulesByClasscode.filter(schedule => schedule.DATESTAMP_ISO === date);
      this.startTimes = [...new Set(this.schedulesByClasscodeDate.map(schedule => schedule.TIME_FROM))].sort();
      this.endTimes = [...new Set(this.schedulesByClasscodeDate.map(schedule => schedule.TIME_TO))].sort();
      this.startTime = '';
      this.endTime = '';

      if (propagate && this.startTimes.length === 1) {
        this.changeStartTime(this.startTime = this.startTimes[0]);
      }
    } else {
      const d = new Date();
      if (date === isoDate(d)) { // current day
        const nowMins = d.getHours() * 60 + d.getMinutes();
        const firstFutureClass = this.timings.find(time => nowMins < parseTime(time));
        this.manualStartTimes = this.timings.slice(0, this.timings.indexOf(firstFutureClass));
      } else {
        this.manualStartTimes = this.timings;
      }
    }
  }

  /** Swap auto and manual mode. */
  swapMode() {
    this.auto = !this.auto;
    (this.classcodeInput as any).el.addEventListener('click', (ev: MouseEvent) => {
      ev.stopPropagation();
      this.chooseClasscode();
    }, true);
  }

  /** Change start time, find matching end time. */
  changeStartTime(startTime: string) {
    if (this.auto) {
      const schedule = this.schedulesByClasscodeDate.find(s => s.TIME_FROM === startTime);
      this.endTime = schedule.TIME_TO;
      this.classType = schedule.TYPE;
    } else {
      this.manualEndTimes = this.timings.slice(this.timings.indexOf(startTime) + 1);
    }
  }

  /** Mark attendance, send feedback if necessary. */
  async mark() {
    if (!this.auto) {
      const body = {
        classcodes: this.classcodes,
        schedules: this.schedules,
        schedulesByClasscode: this.schedulesByClasscode,
        schedulesByClasscodeDate: this.schedulesByClasscodeDate,

        dates: this.dates,
        startTimes: this.startTimes,
        endTimes: this.endTimes,

        classcode: this.classcode,
        date: this.date,
        startTime: this.startTime,
        endTime: this.endTime,
        classType: this.classType,

        manualClasscodes: this.manualClasscodes,
        manualDates: this.manualDates,
        manualStartTimes: this.manualStartTimes,
        manualEndTimes: this.manualEndTimes,

        manualClasscode: this.manualClasscode,
        manualDate: this.manualDate,
        manualStartTime: this.manualStartTime,
        manualEndTime: this.manualEndTime,
        manualClassType: this.manualClassType,

        now: new Date(),
      };
      await this.ws.post('/attendix/selection', { body }).toPromise();
    }
    this.router.navigate(['/attendix/mark-attendance', {
      classcode: this.auto ? this.classcode : this.manualClasscode,
      date: this.auto ? this.date : this.manualDate,
      startTime: this.auto ? this.startTime : this.manualStartTime,
      endTime: this.auto ? this.endTime : this.manualEndTime,
      classType: this.auto ? this.classType : this.manualClassType,
      defaultAttendance: 'N',
    }]);
  }

  /** Mark confirmation. */
  confirmMark() {
    this.alertCtrl.create({
      header: 'Confirm mark / edit attendance?',
      message: 'All records will be absent by default if uninitialized, can be deleted later.',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary'
        },
        {
          text: 'Confirm',
          handler: () => this.mark()
        }
      ]
    }).then(alert => alert.present());
  }

  /** Set settings to use attendix ui/ux update. */
  tryv1() {
    this.settings.set('attendixv1', true);
    this.router.navigate(['attendix', 'classes', 'new', this.route.snapshot.params],
      { replaceUrl: true });
  }

}
