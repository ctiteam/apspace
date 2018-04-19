import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { tap, finalize } from 'rxjs/operators';

import { WsApiProvider } from '../../providers';
import { Courses, Subcourses } from '../../interfaces';




@IonicPage()
@Component({
  selector: 'page-results',
  templateUrl: 'results.html',
  providers: []
})

export class ResultsPage {

  intakes$: Observable<Courses[]>;
  courses$: Observable<Subcourses[]>;

  selectedIntake: string;

  constructor(
    private ws: WsApiProvider) {
  }

  ionViewDidLoad() {
    this.doRefresh();
  }

  doRefresh(refresher?) {
    this.intakes$ = this.ws.get<Courses[]>('/student/courses', Boolean(refresher))
      .pipe(
        tap(i => this.selectedIntake = i[0].INTAKE_CODE),
        tap(i => this.getSubcourses(i[0].STUDENT_NUMBER, i[0].INTAKE_CODE)),
        finalize(() => refresher && refresher.complete())
      )
  }

  getSubcourses(student_id: string, intake_code: string) {
    let params = { format: 'json', id: student_id };

    this.courses$ = this.ws.get<Subcourses[]>
      (`/student/subcourses?intake=${intake_code}`,
      false, { params: params });
  }
}
