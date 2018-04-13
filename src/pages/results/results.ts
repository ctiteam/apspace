import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { WsApiProvider } from '../../providers';
import { Courses } from '../../interfaces';
import { Subcourses } from '../../interfaces/subcourses';

import { Observable } from 'rxjs/Observable';
import { tap, finalize} from 'rxjs/operators';


@IonicPage()
@Component({
  selector: 'page-results',
  templateUrl: 'results.html',
  providers: []
})

export class ResultsPage {

  intakes$: Observable<Courses[]>;
  courses$: Observable<Subcourses[]>;
  response: any;


  constructor(
    private ws: WsApiProvider) {
  }

  getSubcourses(student_id: string, intake_code: string) {
    let params = { format: 'json', id: student_id };

    this.courses$ = this.ws.get<Subcourses[]>
      (`/student/subcourses?intake=${intake_code}`,
      false, { params: params });
  }

  doRefresh(refresher?) {
    this.intakes$ = this.ws.get<Courses[]>('/student/courses', Boolean(refresher))
      .pipe(
        tap(i => this.getSubcourses(i[0].STUDENT_NUMBER, i[0].INTAKE_CODE)),
        finalize(() => refresher && refresher.complete())
      )
  }

  ionViewDidLoad() {
    this.doRefresh();
  }

}
