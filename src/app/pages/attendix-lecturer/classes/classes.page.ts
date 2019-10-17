import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { IonSelect, ModalController } from '@ionic/angular';

import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

import { Classcode, StudentTimetable, StaffProfile } from '../../../interfaces';
import { SearchModalComponent } from '../../../components/search-modal/search-modal.component';
import { StudentTimetableService, WsApiService } from '../../../services';

type Schedule = Pick<Classcode, 'CLASS_CODE'>
  & Pick<StudentTimetable, 'DATESTAMP_ISO' | 'TIME_FROM' | 'TIME_TO'>
  & { TYPE: string; };

@Component({
  selector: 'app-classes',
  templateUrl: './classes.page.html',
  styleUrls: ['./classes.page.scss']
})
export class ClassesPage implements AfterViewInit, OnInit {

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
  date: string;  // 2019-01-01
  startTime: string;
  endTime: string;
  classType: string;

  @ViewChild('classcodeInput', { static: true }) classcodeInput: IonSelect;

  constructor(
    private tt: StudentTimetableService,
    private ws: WsApiService,
    public modalCtrl: ModalController,
  ) { }

  ngOnInit() {
    const d = new Date();
    this.date = this.isoDate(d);

    const timetables$ = forkJoin([this.ws.get<StaffProfile[]>('/staff/profile'), this.tt.get()]).pipe(
      map(([profile, timetables]) => [profile, timetables.map(timetable => { // XXX: temporary modify dates
        if (['ALF', 'ANK', 'BPM', 'CRR', 'CYN', 'FTK', 'GDP', 'HLH', 'JPK',
          'KID', 'LGR', 'LKK', 'LKS', 'LSK', 'MNB', 'MNZ', 'MPJ', 'MUB', 'NFH',
          'NJA', 'PRE', 'SLM', 'SSR', 'SVC', 'SVK', 'SVM', 'TKK', 'TTS', 'VNW',
          'ZAB'].some(key => key === timetable.LECTID)) {
          timetable.SAMACCOUNTNAME = 'Appsteststaff1';
        }
        return timetable;
      })] as [StaffProfile[], StudentTimetable[]]),
      map(([profile, timetables]) => timetables.filter(timetable => profile[0].ID === timetable.SAMACCOUNTNAME)),
    );
    const classcodes$ = this.ws.get<Classcode[]>('/attendix/classcodes');

    forkJoin([timetables$, classcodes$]).subscribe(([timetables, classcodes]) => {
      // left join on classcodes
      const joined = timetables.map(timetable => ({
        ...classcodes.find(classcode => {
          // Classcode BM006-3-2-CRI-L-UC2F1805CGD-CS-DA-IS-IT-BIS-CC-DBA-ISS-MBT-NC-MMT-SE-HLH
          // Take only BM006-3-2-CRI-L
          const len = classcode.SUBJECT_CODE.length;
          // Take only UC2F1805 and CGD-CS-DA-IS-IT-BIS-CC-DBA-ISS-MBT-NC-MMT-SE-HLH
          const [intake, codes] = classcode.CLASS_CODE.slice(len + 1).match(/-?(.*\d{4})(.*)/).slice(1);
          return classcode.CLASS_CODE.slice(0, len + 2) === timetable.MODID.slice(0, len + 2);
            // && timetable.INTAKE.startsWith(intake) // TODO: testing
            // && codes.split('-').includes(timetable.INTAKE.slice(intake.length));
        }),
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
      this.guessWork(joined);

      // append existing timetable after guess work
      const mapped = classcodes.map(({ CLASS_CODE, CLASSES }) =>
        CLASSES.map(({ DATE, TIME_FROM, TIME_TO, TYPE }) =>
          ({ DATESTAMP_ISO: DATE, TIME_FROM, TIME_TO, CLASS_CODE, TYPE })));
      this.schedules = this.schedules.concat.apply([], mapped);
      this.classcodes = [...new Set(this.schedules.map(schedule => schedule.CLASS_CODE).filter(Boolean))].sort();
      console.log('filtered', this.schedules, this.classcodes);
    });
  }

  ngAfterViewInit() {
    // prevent ion-select click bubbling
    (this.classcodeInput as any).el.addEventListener('click', ev => {
      ev.stopPropagation();
      this.chooseClasscode();
    }, true);
  }

  /** Guess the current classcode based on timetable. */
  guessWork(schedules: (Classcode & StudentTimetable)[]) {
    const d = new Date();
    const date = this.isoDate(d);
    const nowMins = d.getHours() * 60 + d.getMinutes();

    const guessSchedules = schedules.filter(schedule => {
      return schedule.DATESTAMP_ISO === date
        // && schedule.LECTID === 'CYN' // XXX: test
        && this.between(schedule.TIME_FROM, schedule.TIME_TO, nowMins);
    });

    if (new Set(guessSchedules.map(schedule => schedule.MODID)).size !== 1) {
      console.error('fail to auto complete', guessSchedules);
      return;
    }
    const currentSchedule = guessSchedules[0];

    this.changeClasscode(this.classcode = currentSchedule.CLASS_CODE, false);
    this.changeDate(this.date = date, false);
    this.changeStartTime(this.startTime = currentSchedule.TIME_FROM);
    console.log('currentSchedule', currentSchedule);
  }

  /** Identify if time is between start and end time in 12:59 PM format. */
  between(start: string, end: string, nowMins: number): boolean {
    const startMins = ((start.slice(-2) === 'PM' ? 12 : 0) + +start.slice(0, 2) % 12) * 60 + +start.slice(3, 5);
    const endMins = ((end.slice(-2) === 'PM' ? 12 : 0) + +end.slice(0, 2) % 12) * 60 + +end.slice(3, 5);
    return startMins <= nowMins && nowMins <= endMins;
  }

  /** Display search modal to choose classcode. */
  async chooseClasscode() {
    const modal = await this.modalCtrl.create({
      component: SearchModalComponent,
      componentProps: {
        items: this.classcodes,
        defaultItems: this.classcodes,
        notFound: 'No classcode selected'
      }
    });
    await modal.present();
    const { data: { item: classcode } = { item: this.classcode } } = await modal.onDidDismiss();
    if (classcode !== null && classcode !== this.classcode) {
      console.log('changed classcode');
      this.changeClasscode(this.classcode = classcode);
    }
  }

  /** Change classcode, auto select class type. */
  changeClasscode(classcode: string, propagate = true) {
    this.schedulesByClasscode = this.schedules.filter(schedule => schedule.CLASS_CODE === classcode);
    this.dates = [...new Set(this.schedulesByClasscode.map(schedule => schedule.DATESTAMP_ISO))].sort();
    this.date = '';

    if (propagate && this.dates.length === 1) {
      this.changeDate(this.date = this.dates[0]);
    }
  }

  /** Change date. */
  changeDate(date: string, propagate = true) {
    this.schedulesByClasscodeDate = this.schedulesByClasscode.filter(schedule => schedule.DATESTAMP_ISO === date);
    this.startTimes = [...new Set(this.schedulesByClasscodeDate.map(schedule => schedule.TIME_FROM))].sort();
    this.endTimes = [...new Set(this.schedulesByClasscodeDate.map(schedule => schedule.TIME_TO))].sort();
    this.startTime = '';
    this.endTime = '';

    if (propagate && this.startTimes.length === 1) {
      this.changeStartTime(this.startTime = this.startTimes[0]);
    }
  }

  /** Change start time, find matching end time. */
  changeStartTime(startTime: string) {
    const schedule = this.schedulesByClasscodeDate.find(s => s.TIME_FROM === startTime);
    this.endTime = schedule.TIME_TO;
    this.classType = schedule.TYPE;
  }

  /** Helper function to get ISO 8601 Date from Date. */
  private isoDate(d: Date): string {
    return `${d.getFullYear()}-${('0' + (d.getMonth() + 1)).slice(-2)}-${('0' + d.getDate()).slice(-2)}`;
  }

}
