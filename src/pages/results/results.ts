import { Component } from '@angular/core';
import { ActionSheet, ActionSheetOptions } from '@ionic-native/action-sheet';
import {
  ActionSheetButton,
  ActionSheetController,
  IonicPage,
  Platform,
} from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { finalize, tap } from 'rxjs/operators';

import {
  ClassificationLegend,
  Course,
  CourseDetails,
  DeterminationLegend,
  InterimLegend,
  MPULegend,
  StudentProfile,
  Subcourse,
} from '../../interfaces';
import { WsApiProvider } from '../../providers';

@IonicPage()
@Component({
  providers: [],
  selector: 'page-results',
  templateUrl: 'results.html',
})
export class ResultsPage {
  course$: Observable<Course[]>;
  result$: Observable<Subcourse>;
  courseDetail$: Observable<CourseDetails>;
  interimLegend$: Observable<InterimLegend[]>;
  mpuLegend$: Observable<MPULegend[]>;
  determinationLegend$: Observable<DeterminationLegend[]>;
  classificationLegend$: Observable<ClassificationLegend[]>;

  type = 'bar';
  data: any;
  selectedIntake: string;
  intakeLabels: any;
  block: boolean = false;
  message: string;

  options = {
    legend: {
      display: false,
    },
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
            stepSize: 1,
          },
        },
      ],
    },
  };

  numOfSkeletons = new Array(4);

  constructor(
    private ws: WsApiProvider,
    public plt: Platform,
    private actionSheet: ActionSheet,
    private actionSheetCtrl: ActionSheetController) { }

  getResults(intake: string, refresh: boolean = false): Observable<Subcourse> {
    const url = `/student/subcourses?intake=${intake}`;
    return (this.result$ = this.ws.get<Subcourse>(url, refresh).pipe(
      tap(r => this.getInterimLegend(intake, r, refresh)),
      tap(_ => this.getCourseDetails(intake, refresh)),
      tap(_ => this.getMpuLegend(intake, refresh)),
      tap(_ => this.getDeterminationLegend(intake, refresh)),
      tap(_ => this.getClassificatinLegend(intake, refresh)),
    ));
  }

  ionViewDidLoad() {
    this.doRefresh();
  }

  doRefresh(refresher?) {
    this.ws.get<StudentProfile>('/student/profile', true).subscribe(p => {
      if (p.BLOCK === true) {
        this.block = false;
        this.course$ = this.ws.get<Course[]>('/student/courses', true).pipe(
          tap(i => this.selectedIntake = i[0].INTAKE_CODE),
          tap(i => this.result$ = this.getResults(i[0].INTAKE_CODE, true)),
          tap(i => this.intakeLabels = Array.from(new Set((i || []).map(t => t.INTAKE_CODE)))),
          finalize(() => refresher && refresher.complete())
        );
      } else {
        this.block = true;
        this.message = p.MESSAGE;
      }
    });
  }

  getCourseDetails(intake: string, refresh: boolean): Observable<CourseDetails> {
    const url = `/student/sub_and_course_details?intake=${intake}`;
    return this.courseDetail$ = this.ws.get<CourseDetails>(url, refresh);
  }

  getInterimLegend(intake: string, results: any, refresh: boolean) {
    const url = `/student/interim_legend?intake=${intake}`;
    this.interimLegend$ = this.ws.get<InterimLegend[]>(url, refresh).pipe(
      tap(res => {
        const gradeList = Array.from(new Set((res || []).map(grade => grade.GRADE)));
        this.sortGrades(results, gradeList);
      }),
    );
  }

  getMpuLegend(intake: string, refresh: boolean) {
    const url = `/student/mpu_legend?intake=${intake}`;
    this.mpuLegend$ = this.ws.get<MPULegend[]>(url, refresh);
  }

  getDeterminationLegend(intake: string, refresh: boolean) {
    const url = `/student/determination_legend?intake=${intake}`;
    this.determinationLegend$ = this.ws.get<DeterminationLegend[]>(url, refresh);
  }

  getClassificatinLegend(intake: string, refresh: boolean) {
    const url = `/student/classification_legend?intake=${intake}`;
    this.classificationLegend$ = this.ws.get<ClassificationLegend[]>(url, refresh);
  }

  sortGrades(results: any, gradeList: any) {
    const gradeCounter: { [index: string]: number } = results
      .map(r => r.GRADE)
      .reduce((acc, v) => {
        acc[v] = (acc[v] || 0) + 1;
        return acc;
      }, {});

    const studentResults = Object.keys(gradeCounter)
      .filter(g => g.length <= 2)
      .sort((a, b) => gradeList.indexOf(a) - gradeList.indexOf(b))
      .map(k => ({ grade: k, count: gradeCounter[k] }));

    const grades = studentResults.map(r => r.grade);
    const count = studentResults.map(r => r.count);
    this.showBarChart(grades, count);
  }

  showBarChart(listItems, listCount) {
    const randomColor = [
      'rgba(255, 99, 132, 0.7)',
      'rgba(54, 162, 235, 0.7)',
      'rgba(255, 206, 86, 0.7)',
      'rgba(75, 192, 192, 0.7)',
      'rgba(153, 102, 255, 0.7)',
      'rgba(255, 159, 64, 0.7)',
      'rgba(54,72,87,0.7)',
      'rgba(247,89,64,0.7)',
      'rgba(61,199,190,0.7)',
    ];

    const randomBorderColor = [
      'rgba(255,99,132,1)',
      'rgba(54, 162, 235, 1)',
      'rgba(255, 206, 86, 1)',
      'rgba(75, 192, 192, 1)',
      'rgba(153, 102, 255, 1)',
      'rgba(255, 159, 64, 1)',
      'rgba(54,72,87,1)',
      'rgba(247,89,64,1)',
      'rgba(61,199,190,1)',
    ];

    this.data = {
      datasets: [
        {
          backgroundColor: randomColor,
          borderColor: randomBorderColor,
          borderWidth: 2,
          data: listCount,
        },
      ],
      labels: listItems,
    };
  }

  showActionSheet() {
    if (this.plt.is('cordova')) {
      const options: ActionSheetOptions = {
        buttonLabels: this.intakeLabels,
        addCancelButtonWithLabel: 'Cancel',
      };
      this.actionSheet.show(options).then((buttonIndex: number) => {
        if (buttonIndex <= this.intakeLabels.length) {
          this.selectedIntake = this.intakeLabels[buttonIndex - 1] || '';
          this.getResults(this.selectedIntake);
        }
      });
    } else {
      const intakesButton = this.intakeLabels.map(intake => {
        return {
          text: intake, handler: () => {
            this.selectedIntake = intake;
            this.getResults(this.selectedIntake);
          },
        } as ActionSheetButton;
      });
      const actionSheet = this.actionSheetCtrl.create({
        buttons: [...intakesButton, { text: 'Cancel', role: 'cancel' }],
      });
      actionSheet.present();
    }
  }

  trackByFn(index) {
    return index;
  }
}
