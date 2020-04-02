import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, IonSelect, LoadingController, ModalController, ToastController } from '@ionic/angular';

import { Observable, forkJoin } from 'rxjs';
import { map, shareReplay, tap } from 'rxjs/operators';

import * as moment from 'moment';
import { ResetAttendanceGQL, ScheduleInput } from 'src/generated/graphql';
import { SearchModalComponent } from '../../../components/search-modal/search-modal.component';
import { Classcode, StaffProfile, StudentTimetable } from '../../../interfaces';
import { StudentTimetableService, WsApiService } from '../../../services';
import { isoDate, parseTime } from '../date';

type Schedule = Pick<Classcode, 'CLASS_CODE'>
  & Pick<StudentTimetable, 'DATESTAMP_ISO' | 'TIME_FROM' | 'TIME_TO'>
  & { TYPE: string; };

@Component({
  selector: 'app-classes-new',
  templateUrl: './classes-new.page.html',
  styleUrls: ['./classes-new.page.scss'],
})
export class ClassesNewPage implements AfterViewInit, OnInit {
  auto = false; // manual mode to record mismatched data
  keyword = ''; // keyword used to search inside attendance logs
  timeFrame = 7;
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
  classcodesList: Classcode[];


  /* optional paramMap from lecturer timetable */
  paramModuleId: string | null = this.route.snapshot.paramMap.get('moduleId');
  paramDate: string | null = this.route.snapshot.paramMap.get('date'); // 2020-12-31
  paramStartTime: string | null = this.route.snapshot.paramMap.get('startTime');
  paramEndTime: string | null = this.route.snapshot.paramMap.get('endTime');

  /* computed */
  classcodes: string[];
  schedules: Schedule[];
  schedulesByClasscode: Schedule[];
  schedulesByClasscodeDate: Schedule[];

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
  manualDuration: string;
  manualMarkAllAs = 'N';

  @ViewChild('classcodeInput', { static: false }) classcodeInput: IonSelect;

  constructor(
    private tt: StudentTimetableService,
    private ws: WsApiService,
    private route: ActivatedRoute,
    private router: Router,
    public loadingCtrl: LoadingController,
    public modalCtrl: ModalController,
    public toastCtrl: ToastController,
    private resetAttendance: ResetAttendanceGQL,
    private alertCtrl: AlertController
  ) { }

  ngOnInit() {
    const profile$ = this.ws.get<StaffProfile[]>('/staff/profile', { caching: 'cache-only' });
    this.timetablesprofile$ = forkJoin([profile$, this.tt.get()]).pipe(
      shareReplay(1), // no need to refresh rigid data when user came back
    );
  }

  ionViewDidEnter() {
    this.getClasscodes();
  }

  getClasscodes() {
    this.ws.get<Classcode[]>('/attendix/classcodes').pipe(
      tap(classcodes => this.fillManualInputs(classcodes)),
      map(classcodes => {
        classcodes.push({
          CLASS_CODE: 'CTI -DEMO1',
          COURSE_CODE_ALIAS: 'UCMP1111SE3',
          LECTURER_CODE: 'APPSTESTSTAFF1',
          SUBJECT_CODE: 'CE00731-8',
          CLASSES: []
        });
        return classcodes;
      }),
      tap(classcodes => console.log('test: ', classcodes)),
      tap(classcodes => this.classcodesList = classcodes.slice()),
      // tap(_ => console.log(this.mergeObjectsInUnique(this.classcodesList, 'COURSE_CODE_ALIAS'))),
      // tap(_ => console.log(this.mergeObjects(this.classcodesList)))
      // tap(_ => this.moveAllDataInsideArray()),
      // tap(_ => this.extractData()),
      // tap(_ => this.mergeArrays())
    ).subscribe();
  }

  // Testing
  // moveAllDataInsideArray() {
  //   this.classcodesList.forEach(classcodeObj => {
  //     classcodeObj.CLASSES.forEach(classObj => {
  //       classObj['CLASS_CODE'] = classcodeObj.CLASS_CODE;
  //       classObj['LECTURER_CODE'] = classcodeObj.LECTURER_CODE;
  //       classObj['SUBJECT_CODE'] = classcodeObj.SUBJECT_CODE;
  //     });
  //   });
  //   console.log(this.classcodesList);
  // }
  // testArray = [];
  // extractData() {
  //   this.testArray = this.classcodesList.map(({ CLASSES }) => CLASSES);
  // }

  // mergeArrays() {
  //   console.log([].concat.apply([], this.testArray));
  // }

  mergeObjectsInUnique<T>(array: T[], property: any): T[] {
    const newArray = new Map();

    array.forEach((item: T) => {
      const propertyValue = item[property];
      newArray.has(propertyValue)
        ? newArray.set(propertyValue, { ...item, ...newArray.get(propertyValue) })
        : newArray.set(propertyValue, item);
    });

    return Array.from(newArray.values());
  }

  // mergeObjects(arr: Classcode[]) {
  //   const resultArray = [];
  //   const classcodes = [];
  //   // tslint:disable-next-line: forin
  //   for (const item in arr) {
  //     const itemIndex = classcodes.indexOf(arr[item].CLASS_CODE);
  //     if (itemIndex === -1) {
  //       classcodes.push(arr[item].CLASS_CODE);
  //       const obj = {
  //         CLASS_CODE: arr[item].CLASS_CODE,
  //         LECTURER_CODE: arr[item].LECTURER_CODE,
  //         SUBJECT_CODE: arr[item].SUBJECT_CODE,
  //         // INTAKES: [],
  //         CLASSES: []
  //       };
  //       for (const classObj in arr[item].CLASSES) {
  //         const classObjIndex = obj.CLASSES.indexOf()
  //       }
  //       // obj.CLASSES.push(arr[item].CLASSES);
  //       // obj.INTAKES.push(arr[item].COURSE_CODE_ALIAS);
  //       resultArray.push(obj);
  //     } else {
  //       // resultArray[itemIndex].INTAKES.push(arr[item].COURSE_CODE_ALIAS);
  //       // resultArray[itemIndex].CLASSES.push(arr[item].CLASSES);
  //     }

  //   }
  //   return resultArray;
  // }

  ngAfterViewInit() {
    // prevent ion-select click bubbling
    (this.classcodeInput as any).el.addEventListener('click', (ev: MouseEvent) => {
      ev.stopPropagation();
      this.chooseClasscode();
    }, true);
  }

  /** Display search modal to choose classcode. */
  async chooseClasscode() {
    const modal = await this.modalCtrl.create({
      component: SearchModalComponent,
      componentProps: {
        items: this.manualClasscodes,
        defaultItems: this.manualClasscodes,
        notFound: 'No classcode selected'
      }
    });
    await modal.present();
    const { data: { item: classcode } } = await modal.onDidDismiss();

    this.manualClasscode = classcode;
  }

  // /** Fill manual inputs. */
  fillManualInputs(classcodes: Classcode[]) {
    this.manualClasscodes = [...new Set(classcodes.map(classcode => classcode.CLASS_CODE))];
    this.manualDates = [...Array(30).keys()]
      .map(n => isoDate(new Date(new Date().setDate(new Date().getDate() - n))));
  }

  /** Change date. */
  changeDate(date: string) {
    const d = new Date();
    if (date === isoDate(d)) { // current day
      const nowMins = d.getHours() * 60 + d.getMinutes();
      const firstFutureClass = this.timings.find(time => nowMins < parseTime(time));
      this.manualStartTimes = this.timings.slice(0, this.timings.indexOf(firstFutureClass));
    } else {
      this.manualStartTimes = this.timings;
    }
  }

  /** Change start time, find matching end time. */
  changeStartTime(startTime: string) {
    this.manualEndTimes = this.timings.slice(this.timings.indexOf(startTime) + 1);
    if (this.manualDuration) { // if duration was selected before start date => update it
      this.calculateEndTime();
    }
  }

  // endtime = starttime + duration (in minutes)
  calculateEndTime() {
    // TODO: all console.log are for testing purposes | will be removed before deploying
    console.log('start time is: ', this.manualStartTime);
    console.log('duration is: ', this.manualDuration);
    this.manualEndTime = moment(this.manualStartTime, 'hh:mm A').add(this.manualDuration, 'minutes').format('hh:mm A').toString();
    console.log('end time is: ', this.manualEndTime);
  }

  /** Mark attendance, send feedback if necessary. */
  async mark() {
    const body = {
      classcodes: this.classcodes,
      schedules: this.schedules,
      schedulesByClasscode: this.schedulesByClasscode,
      schedulesByClasscodeDate: this.schedulesByClasscodeDate,

      dates: [],
      startTimes: [],
      endTimes: [],

      classcode: '',
      date: '',
      startTime: '',
      endTime: '',
      classType: '',

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
    this.router.navigate(['/attendix/mark-attendance-new', {
      classcode: this.manualClasscode,
      date: this.manualDate,
      startTime: this.manualStartTime,
      endTime: this.manualEndTime,
      classType: this.manualClassType,
      markAllAs: this.manualMarkAllAs
    }]);
  }

  edit(classcode: string, date: string, startTime: string, endTime: string, classType: string) {
    this.router.navigate(['/attendix/mark-attendance-new', { classcode, date, startTime, endTime, classType }]);
  }

  /** delete (reset) attendance, double confirm. */
  delete(classcode: string, date: string, startTime: string, endTime: string, classType: string) {
    const schedule: ScheduleInput = { classcode, date, startTime, endTime, classType };

    this.alertCtrl.create({
      header: 'Warning!',
      message: `The attendance record for ${classcode} on ${date} will be <strong>deleted</strong>!`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Delete',
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
}
