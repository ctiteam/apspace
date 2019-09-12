import { Component, OnInit } from '@angular/core';

import { Observable, forkJoin, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { StudentTimetableService, WsApiService } from 'src/app/services';
import { Classcode, StaffProfile } from '../../../interfaces';

import { classcodes as classcodesMock } from './classcodes.mock';

@Component({
  selector: 'app-classes',
  templateUrl: './classes.page.html',
  styleUrls: ['./classes.page.scss']
})
export class ClassesPage implements OnInit {

  classcodes$: Observable<string[]>;
  classcode: string;
  startTime: string;
  endTime: string;
  classType: string;

  constructor(private tt: StudentTimetableService, private ws: WsApiService) { }

  ngOnInit() {
    this.classcodes$ = forkJoin([
      this.tt.get(),
      of(classcodesMock),
      this.ws.get<StaffProfile>('/staff/profile'),
    ]).pipe(
      tap(([timetables, classcodes, profile]) => {
        const d = new Date();
        const isoDate = `${d.getFullYear()}-${('0' + (d.getMonth() + 1)).slice(-2)}-${('0' + d.getDate()).slice(-2)}`;
        // TODO: guess work
        timetables.forEach(timetable => {
          if (profile.ID === timetable.SAMACCOUNTNAME && timetable.DATESTAMP_ISO === isoDate) {
            console.log(timetable);
          }
        });
      }),
      map(([timetables, classcodes]) => classcodes.map(classcode => classcode.CLASS_CODE)),
    );
  }

  updateAttendance() {
    console.log(this.classcode, this.startTime);
  }
}
