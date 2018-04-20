import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { tap, finalize } from 'rxjs/operators';

import { WsApiProvider } from '../../providers';
import { Course, Subcourse } from '../../interfaces';




@IonicPage()
@Component({
  selector: 'page-results',
  templateUrl: 'results.html',
  providers: []
})

export class ResultsPage {

  intakes$: Observable<Course[]>;
  courses$: Observable<Subcourse[]>;

  selectedIntake: string;

  constructor(
    private ws: WsApiProvider) {
  }

  ionViewDidLoad() {
    this.doRefresh();
  }

  doRefresh(refresher?) {
    this.intakes$ = this.ws.get<Course[]>('/student/courses', Boolean(refresher))
      .pipe(
        tap(i => this.selectedIntake = i[0].INTAKE_CODE),
        tap(i => this.getSubcourse(i[0].STUDENT_NUMBER, i[0].INTAKE_CODE)),
        finalize(() => refresher && refresher.complete())
      )
  }

  getSubcourse(student_id: string, intake_code: string) {
    let params = { format: 'json', id: student_id };
    this.courses$ = this.ws.get<Subcourse[]>
      (`/student/subcourses?intake=${intake_code}`,
      false, { params: params });
  }
}
