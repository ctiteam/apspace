import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { tap, finalize, filter } from 'rxjs/operators';

import { WsApiProvider, LoadingControllerProvider } from '../../providers';
import { Course, Subcourse, Attendance } from '../../interfaces';

@IonicPage()
@Component({
  selector: 'page-results',
  templateUrl: 'results.html',
  providers: []
})

export class ResultsPage {

  intakes$: Observable<Course[]>;
  results$: Observable<Subcourse>;

  selectedIntake: string;
  studentId: string;
  grade_point: number = 0;
  passedModule: any = 0;

  constructor(
    private ws: WsApiProvider,
    public loading: LoadingControllerProvider) { }

  getResults(intake: string, refresh: boolean = false): Observable<Subcourse> {
    this.loading.presentLoading();
    const opt = { params: { id: this.studentId, format: 'json' } };
    return this.results$ = this.ws.get<Subcourse>(`/student/subcourses?intake=${intake}`, refresh, opt).pipe(
      tap(r => this.calculateAverage(r)),
      finalize(() => this.loading.dismissLoading())
    )
  }

  ionViewDidLoad() {
    this.intakes$ = this.ws.get<Course[]>('/student/courses').pipe(
      tap(i => this.selectedIntake = i[0].INTAKE_CODE),
      tap(i => this.studentId = i[0].STUDENT_NUMBER),
      tap(i => this.getResults(this.selectedIntake))
    );
  }

  doRefresh(refresher?) {
    this.results$ = this.getResults(this.selectedIntake, true).pipe(
      finalize(() => refresher.complete())
    )
  }



  calculateAverage(results: any) {
    let sumOfGradePoint = 0;

    //Calculate total module passed
    this.passedModule = (results.filter(gpa => gpa.GRADE == 'A+' || gpa.GRADE == 'A' || gpa.GRADE == 'A-' || gpa.GRADE == 'B+'
      || gpa.GRADE == 'B' || gpa.GRADE == 'B-' || gpa.GRADE == 'C+' || gpa.GRADE == 'C' || gpa.GRADE == 'C-' || gpa.GRADE == 'Pass')).length;

    //Calculate total average GPA
    let test = (results.filter(grade => grade.GRADE_POINT == 0 && grade.GRADE == 'Pass' || grade.GRADE == 'Fail'))
    for (let gradePoint of results) {
      sumOfGradePoint += parseFloat(gradePoint.GRADE_POINT);
    }
    if (!test) {
      let averageGradePoint = (sumOfGradePoint / (results.length)).toFixed(2);
      this.grade_point = parseFloat(averageGradePoint);
    } else {
      let averageGradePoint = (sumOfGradePoint / (results.length - 1)).toFixed(2);
      this.grade_point = parseFloat(averageGradePoint);
    }
  }
}
