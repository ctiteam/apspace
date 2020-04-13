import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, LoadingController, ModalController, ToastController } from '@ionic/angular';

import { DatePipe } from '@angular/common';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { ResetAttendanceGQL, ScheduleInput } from 'src/generated/graphql';
import { SearchModalComponent } from '../../../components/search-modal/search-modal.component';
import { Classcode } from '../../../interfaces';
import { SettingsService, WsApiService } from '../../../services';
import { formatTime, isoDate, parseTime } from '../date';

@Component({
  selector: 'app-classes-new',
  templateUrl: './classes-new.page.html',
  styleUrls: ['./classes-new.page.scss'],
  providers: [DatePipe]
})
export class ClassesNewPage {

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

  durations = [
    { value: 30, title: '30 Minutes' },
    { value: 45, title: '45 Minutes' },
    { value: 60, title: '1 Hour' },
    { value: 75, title: '1 Hour 15 Minutes' },
    { value: 90, title: '1 Hour 30 Minutes' },
    { value: 105, title: '1 Hour 45 Minutes' },
    { value: 120, title: '2 Hours' },
    { value: 135, title: '2 Hours 15 Minutes' },
    { value: 150, title: '2 Hours 30 Minutes' },
    { value: 165, title: '2 Hours 45 Minutes' },
    { value: 180, title: '3 Hours' },
    { value: 195, title: '3 Hours 15 Minutes' },
    { value: 210, title: '3 Hours 30 Minutes' },
    { value: 225, title: '3 Hours 45 Minutes' },
    { value: 240, title: '4 Hours' },
  ];

  classTypes = ['Lecture', 'Tutorial', 'Lab'];
  skeletons = new Array(2);

  auto = false; // manual mode to record mismatched data
  term = ''; // classcode search term
  timeFrame = 7; // show the attendance history for the last 7 days by default

  /* optional paramMap from lecturer timetable */
  paramModuleId: string | null = this.route.snapshot.paramMap.get('moduleId');
  paramDate: string | null = this.route.snapshot.paramMap.get('date'); // 2020-12-31
  paramStartTime: string | null = this.route.snapshot.paramMap.get('startTime');
  paramEndTime: string | null = this.route.snapshot.paramMap.get('endTime');

  classcodes$: Observable<Classcode[]>;
  dates: string[];
  startTimes: string[];

  classcode: string;
  date: string;
  startTime: string;
  endTime: string;
  classType: string;
  duration: number;
  defaultAttendance = 'N'; // default is absent

  constructor(
    public loadingCtrl: LoadingController,
    public modalCtrl: ModalController,
    public toastCtrl: ToastController,
    private alertCtrl: AlertController,
    private datePipe: DatePipe,
    private resetAttendance: ResetAttendanceGQL,
    private route: ActivatedRoute,
    private router: Router,
    private settings: SettingsService,
    private ws: WsApiService,
  ) { }

  ionViewDidEnter() {
    if (this.paramModuleId && this.paramDate && this.paramStartTime && this.paramEndTime) {
      // TODO: module id
      this.changeDate(this.date = this.paramDate);
      this.startTime = this.paramStartTime;
      this.endTime = this.paramEndTime;
      this.duration = parseTime(this.endTime) - parseTime(this.startTime);
    }

    this.getClasscodes();
    this.dates = [...Array(30).keys()]
      .map(n => isoDate(new Date(new Date().setDate(new Date().getDate() - n))));
  }

  getClasscodes() {
    this.classcodes$ = this.ws.get<Classcode[]>('/attendix/classcodes').pipe(
      map(classcodes => this.mergeClasscodes(classcodes)), // side effect
      shareReplay(1),
    );
  }

  /** Merge and sort classcodes by intakes, this mutates the original array. */
  mergeClasscodes(classcodes: Classcode[]): Classcode[] {
    const merged = classcodes.reduce((acc, classcode) => {
      const sameClasscode = acc.get(classcode.CLASS_CODE);
      if (sameClasscode) {
        // merge statistics repeated with different intake
        const uniqueClasses = classcode.CLASSES.filter(klass => {
          const sameClass = sameClasscode.CLASSES.find(sklass =>
            sklass.DATE === klass.DATE && sklass.TIME_FROM === klass.TIME_FROM
            && sklass.TIME_TO === klass.TIME_TO && sklass.TYPE === klass.TYPE);
          if (sameClass) { // add the current stats the previous stats
            sameClass.TOTAL.PRESENT += klass.TOTAL.PRESENT;
            sameClass.TOTAL.LATE += klass.TOTAL.LATE;
            sameClass.TOTAL.ABSENT += klass.TOTAL.ABSENT;
            sameClass.TOTAL.ABSENT_REASON += klass.TOTAL.ABSENT_REASON;
          }
          return !sameClass; // only filter those not processed
        });
        sameClasscode.CLASSES.push(...uniqueClasses);
      } else { // classcode not found it map yet
        acc.set(classcode.CLASS_CODE, classcode);
      }
      return acc;
    }, new Map() as Map<string, Classcode>);
    // sort it once by date and time from
    for (const classcode of merged.values()) {
      classcode.CLASSES.sort((a, b) => Date.parse(b.DATE) - Date.parse(a.DATE)
        + parseTime(b.TIME_FROM) - parseTime(a.TIME_FROM));
    }
    return Array.from(merged.values());
  }

  /** Display search modal to choose classcode. */
  async chooseClasscode() {
    const classcodes = (await this.classcodes$.toPromise()).map(c => c.CLASS_CODE);
    const modal = await this.modalCtrl.create({
      component: SearchModalComponent,
      componentProps: {
        items: classcodes,
        defaultItems: classcodes,
        notFound: 'No classcode selected'
      }
    });
    await modal.present();
    const { data: { item: classcode } = { item: this.classcode } } = await modal.onDidDismiss();
    if (classcode !== this.classcode) {
      this.classcode = classcode;
    }
  }

  /** Change date. */
  changeDate(date: string) {
    const d = new Date();
    if (date === isoDate(d)) { // current day
      const nowMins = d.getHours() * 60 + d.getMinutes();
      const firstFutureClass = this.timings.find(time => nowMins < parseTime(time));
      this.startTimes = this.timings.slice(0, this.timings.indexOf(firstFutureClass));
    } else {
      this.startTimes = this.timings;
    }
  }

  /** if start time updated after duration => update duration . */
  changeStartTime(_startTime: string) {
    if (this.duration) {
      this.calculateEndTime(this.duration);
    }
  }

  /** Calculate end time using start time and duration. */
  calculateEndTime(duration: number) {
    this.endTime = formatTime(parseTime(this.startTime) + duration);
  }

  /** Mark attendance, send feedback if necessary. double confirm */
  async mark() {
    this.alertCtrl.create({
      cssClass: 'delete-warning',
      header: 'Warning!',
      message: `By clicking on <span class="text-bold">'Continue'</span>, all students will be marked as ${this.defaultAttendance === 'Y' ? 'Present' : 'Absent'} by default! ${this.defaultAttendance === 'Y' ? '<br><br> <span class="text-bold">**Since you chose to mark all as Present by default, there will be no QR code displayed.</span>' : '.'}`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary-txt-color',
        },
        {
          text: 'Continue',
          cssClass: 'colored-text',
          handler: () => {
            this.router.navigate(['/attendix/mark-attendance', {
              classcode: this.classcode,
              date: this.date,
              startTime: this.startTime,
              endTime: this.endTime,
              classType: this.classType,
              defaultAttendance: this.defaultAttendance
            }]);
          }
        }
      ]
    }).then(alert => alert.present());
  }

  /** Clear all form data. */
  ionViewDidLeave() {
    this.classcode = '';
    this.date = '';
    this.startTime = '';
    this.endTime = '';
    this.classType = '';
    this.defaultAttendance = 'N';
    this.duration = 0;
  }

  /** Edit current attendance. */
  edit(classcode: string, date: string, startTime: string, endTime: string, classType: string) {
    this.router.navigate(['/attendix/mark-attendance', { classcode, date, startTime, endTime, classType }]);
  }

  /** Delete (reset) attendance, double confirm. */
  reset(classcode: string, date: string, startTime: string, endTime: string, classType: string) {
    const schedule: ScheduleInput = { classcode, date, startTime, endTime, classType };

    this.alertCtrl.create({
      cssClass: 'delete-warning',
      header: 'Delete Attendance Record!',
      message: `Are you sure that you want to <span class="danger-text text-bold">Permanently Delete</span> the selected attendance record?<br><br> <span class="text-bold">Class Code:</span> ${classcode}<br> <span class="text-bold">Class Date:</span> ${this.datePipe.transform(date, 'EEE, dd MMM yyy')}<br> <span class="text-bold">Class Time:</span> ${startTime} - ${endTime}<br> <span class="text-bold">Class Type:</span> ${classType}`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary-txt-color',
        },
        {
          text: 'Delete',
          cssClass: 'danger-text',
          handler: () => {
            this.resetAttendance.mutate({ schedule }).subscribe(
              () => {
                this.toastCtrl.create({
                  message: 'Attendance deleted',
                  duration: 3000,
                  position: 'top',
                  color: 'success',
                  showCloseButton: true,
                }).then(toast => toast.present());
                this.getClasscodes();
              },
              e => {
                this.toastCtrl.create({
                  message: 'Attendance delete failed: ' + e,
                  duration: 3000,
                  position: 'top',
                  color: 'danger',
                  showCloseButton: true,
                }).then(toast => toast.present());
                console.error(e);
              }
            );
          }
        }
      ]
    }).then(alert => alert.present());
  }

  /** Set settings to old attendix ui/ux update. */
  tryv0() {
    this.settings.set('attendixv1', false);
    this.router.navigate(['/attendix/classes'],
      { queryParamsHandling: 'preserve', replaceUrl: true });
  }

}
