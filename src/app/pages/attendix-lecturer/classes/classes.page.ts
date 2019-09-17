import { Component, OnInit } from '@angular/core';

import { forkJoin, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { StudentTimetableService, WsApiService } from 'src/app/services';
import { Classcode, StudentTimetable, StaffProfile } from '../../../interfaces';

import { classcodes as classcodesMock } from './classcodes.mock';

@Component({
  selector: 'app-classes',
  templateUrl: './classes.page.html',
  styleUrls: ['./classes.page.scss']
})
export class ClassesPage implements OnInit {

  /* computed */
  schedules: (StudentTimetable & Classcode)[];
  schedulesByClasscode: (StudentTimetable & Classcode)[];
  schedulesByClasscodeDate: (StudentTimetable & Classcode)[];

  dates: string[];
  startTimes: string[];
  endTimes: string[];
  classTypes = ['Lecture', 'Tutorial', 'Lab'];

  /* selected */
  classcode: string;
  date = '1970-01-01';
  startTime: string;
  endTime: string;
  classType: string;

  constructor(private tt: StudentTimetableService, private ws: WsApiService) { }

  ngOnInit() {
    const d = new Date();
    // d.setDate(d.getDate() - 1); // XXX: temporary
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
    const classcodes$ = of(classcodesMock);

    forkJoin([timetables$, classcodes$]).subscribe(([timetables, classcodes]) => {
      // left join on classcodes
      this.schedules = timetables.map(timetable => ({
        ...classcodes.find(classcode => {
          const len = classcode.SUBJECT_CODE.length + 2;
          return classcode.CLASS_CODE.slice(0, len) === timetable.MODID.slice(0, len);
        }),
        ...timetable
      }));
      this.guessWork(this.schedules);
      console.log(this.schedules.filter(schedule => schedule.CLASS_CODE));
    });
  }

  /** Guess the current classcode based on timetable. */
  guessWork(schedules: (StudentTimetable & Classcode)[]) {
    const d = new Date();
    const date = this.isoDate(d);
    // const nowMins = (d.getHours() + 1) * 60 + d.getMinutes();
    const nowMins = 900; // XXX: test

    const guessSchedules = schedules.filter(schedule => {
      return schedule.DATESTAMP_ISO === date
        && schedule.LECTID === 'NJA' // XXX: test
        && this.between(schedule.TIME_FROM, schedule.TIME_TO, nowMins);
    });

    if (new Set(guessSchedules.map(schedule => schedule.MODID)).size !== 1) {
      console.error('fail to auto complete', guessSchedules);
      return;
    }
    const currentSchedule = guessSchedules[0];

    this.changeClasscode(this.classcode = currentSchedule.CLASS_CODE);
    this.changeDate(this.date = date);
    this.changeStartTime(this.startTime = currentSchedule.TIME_FROM);
    console.log('currentSchedule', currentSchedule);
  }

  /** Identify if time is between start and end time in 12:59 PM format. */
  between(start: string, end: string, nowMins: number): boolean {
    const startMins = ((start.slice(-2) === 'PM' ? 12 : 0) + +start.slice(0, 2) % 12) * 60 + +start.slice(3, 5);
    const endMins = ((end.slice(-2) === 'PM' ? 12 : 0) + +end.slice(0, 2) % 12) * 60 + +end.slice(3, 5);
    return startMins <= nowMins && nowMins <= endMins;
  }

  /** Change classcode, auto select class type. */
  changeClasscode(classcode: string) {
    this.schedulesByClasscode = this.schedules.filter(schedule => schedule.CLASS_CODE === classcode);
    this.date = '';
    this.dates = [...new Set(this.schedulesByClasscode.map(schedule => schedule.DATESTAMP_ISO))];

    const matchSchedule = this.schedules.find(schedule => schedule.CLASS_CODE === classcode);
    if (matchSchedule.SUBJECT_CODE) {
      const len = matchSchedule.SUBJECT_CODE.length;
      if (classcode[len + 1] === 'T') {
        this.classType = 'Tutorial';
      } else if (classcode[len + 2] === 'A') {
        this.classType = 'Lab';
      } else if (classcode[len + 1] === 'L') {
        this.classType = 'Lecture';
      }
    } else {
      console.error('schedule subject code not found', matchSchedule);
    }
  }

  /** Change date. */
  changeDate(date: string) {
    this.schedulesByClasscodeDate = this.schedulesByClasscode.filter(schedule => schedule.DATESTAMP_ISO === date);
    this.startTimes = [...new Set(this.schedulesByClasscode.map(schedule => schedule.TIME_FROM))];
    this.endTimes = [...new Set(this.schedulesByClasscode.map(schedule => schedule.TIME_TO))];
  }

  /** Change start time, find matching end time. */
  changeStartTime(startTime: string) {
    this.endTime = this.schedulesByClasscodeDate.find(schedule => schedule.TIME_FROM === startTime).TIME_TO;
  }

  /** Helper function to get ISO 8601 Date from Date. */
  private isoDate(d: Date): string {
    return `${d.getFullYear()}-${('0' + (d.getMonth() + 1)).slice(-2)}-${('0' + d.getDate()).slice(-2)}`;
  }

}
