import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { publishLast, refCount } from 'rxjs/operators';
import { ExamSchedule } from '../interfaces';

@Injectable()
export class ExamScheduleProvider {

  examScheduleUrl = 'https://api.apiit.edu.my/examination/';

  constructor(public http: HttpClient) {}

  /**
   * GET: Request exam schedule
   *
   * @param tpnumber student number
   * @param intake student intake code
   * @param refresh force refresh (default: false)
   */
  get(tpnumber: string, intake: string, refresh?: boolean): Observable<ExamSchedule[]>{
    const url = `${this.examScheduleUrl}?id=${tpnumber}&intake=${intake}`;
    return this.http.get<ExamSchedule[]>(url).pipe(publishLast(), refCount());
  }
}
