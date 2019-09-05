import { Component, OnInit } from '@angular/core';
import { WsApiService } from 'src/app/services';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-view-progress-report',
  templateUrl: './view-progress-report.page.html',
  styleUrls: ['./view-progress-report.page.scss'],
})
export class ViewProgressReportPage implements OnInit {
  stagingUrl = 'https://kh1rvo4ilf.execute-api.ap-southeast-1.amazonaws.com/dev/aplc';

  subjects$: Observable<any>; // to create interface
  classes$: Observable<any>; // to create interface
  scoreLegend$: Observable<any>; // to create interface
  descriptionLegend$: Observable<any>; // to create interface
  classDescription$: Observable<any>;
  studentsBehaviour$: Observable<any>;


  subjectCode: string;
  classCode: string;
  showClassCodeLoading: false;

  constructor(
    private ws: WsApiService,
  ) { }

  ngOnInit() {
    this.initData();
  }

  initData() { // changed with refresher
    this.subjects$ = this.ws.get<any>(`/subjects`, true, { url: this.stagingUrl });
    this.scoreLegend$ = this.ws.get<any[]>(`/score-legend`, false, { url: this.stagingUrl });
    this.descriptionLegend$ = this.ws.get<any[]>(`/description-legend`, false, { url: this.stagingUrl });
  }

  onSubjectCodeChange() {
    this.classes$ = this.ws.get<any>(`/classes?subject_code=${this.subjectCode}`, true, { url: this.stagingUrl }).pipe(
      tap(_ => this.classCode = '')
    );
  }

  onClassCodeChange() {
    this.classDescription$ = this.ws.get<any>(`/class-description?class_code=${this.classCode}`, true, { url: this.stagingUrl });
    this.studentsBehaviour$ = this.ws.get<any>(`/student-behavior?class_code=${this.classCode}`, true, { url: this.stagingUrl });
  }

}
