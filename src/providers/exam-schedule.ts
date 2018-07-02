import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { ExamSchedule } from '../interfaces';

@Injectable()
export class ExamScheduleProvider {

  examScheduleUrl = 'https://api.apiit.edu.my/examination'

  constructor(public http: HttpClient) {

  }

}
