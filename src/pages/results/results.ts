import { Component } from "@angular/core";
import { IonicPage, Platform, ActionSheetController, ActionSheetButton } from "ionic-angular";
import { Observable } from "rxjs/Observable";
import { tap, finalize } from "rxjs/operators";
import { ActionSheet, ActionSheetOptions } from '@ionic-native/action-sheet';

import { WsApiProvider, LoadingControllerProvider } from "../../providers";
import {
  Course,
  Subcourse,
  CourseDetails,
  InterimLegend,
  MPULegend,
  DeterminationLegend,
  ClassificationLegend,
  StudentProfile,
} from "../../interfaces";

@IonicPage()
@Component({
  selector: "page-results",
  templateUrl: "results.html",
  providers: []
})
export class ResultsPage {
  intakes$: Observable<Course[]>;
  results$: Observable<Subcourse>;
  courseDetails$: Observable<CourseDetails>;
  interimLegend$: Observable<InterimLegend[]>;
  mpuLegend$: Observable<MPULegend[]>;
  determinationLegend$: Observable<DeterminationLegend[]>;
  classificationLegend$: Observable<ClassificationLegend[]>;
  profile$: Observable<StudentProfile[]>;

  type = "bar";
  data: any;
  barChart: any;
  selectedIntake: string = '';
  studentId: string;
  grade_point: number = 0;
  passedModule: any = 0;
  semester1: any;
  semester2: any;
  semester3: any;
  intakeLabels: any;
  block: boolean = false;

  options = {
    legend: {
      display: false
    },
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true
          }
        }
      ]
    }
  };

  constructor(
    private ws: WsApiProvider,
    public loading: LoadingControllerProvider,
    public plt: Platform,
    private actionSheet: ActionSheet,
    private actionSheetCtrl: ActionSheetController) { }

  getResults(intake: string, refresh: boolean = false): Observable<Subcourse> {
    this.loading.presentLoading();
    const opt = { params: { id: this.studentId, format: "json" } };
    return (this.results$ = this.ws
      .get<Subcourse>(`/student/subcourses?intake=${intake}`, refresh, opt)
      .pipe(
        tap(r => this.seperateBySemesters(r)),
        tap(r => this.sortArray(r)),
        tap(_ => this.getCourseDetails(intake)),
        finalize(() => this.loading.dismissLoading())
      ));
  }

  seperateBySemesters(results: any) {
    this.semester1 = results.filter(res => res.SEMESTER == 1);
    this.semester2 = results.filter(res => res.SEMESTER == 2);
    this.semester3 = results.filter(res => res.SEMESTER == 3);
  }

  ionViewDidLoad() {
    this.profile$ = this.ws.get<StudentProfile[]>("/student/profile");
    this.profile$.subscribe(p => {
      if (p[0].BLOCK == true) {
        this.block = false;
        this.intakes$ = this.ws.get<Course[]>("/student/courses").pipe(
          tap(i => (this.selectedIntake = i[0].INTAKE_CODE)),
          tap(i => (this.studentId = i[0].STUDENT_NUMBER)),
          tap(_ => this.getLegend(this.selectedIntake)),
          tap(_ => this.getResults(this.selectedIntake)),
          tap(c => this.intakeLabels = Array.from(new Set((c || []).map(t => t.INTAKE_CODE))))
        );
      } else {
        this.block = true;
      }
    })
  }

  doRefresh(refresher?) {
    this.results$ = this.getResults(this.selectedIntake, true).pipe(
      finalize(() => refresher.complete())
    );
  }

  getCourseDetails(intake: string, refresh: boolean = false): Observable<CourseDetails> {
    const opt = { params: { id: this.studentId, format: "json" } };
    return (this.courseDetails$ = this.ws.get<CourseDetails>(
      `/student/sub_and_course_details?intake=${intake}`,
      refresh,
      opt
    ));
  }

  getLegend(intake: string) {
    this.interimLegend$ = this.ws.get<InterimLegend[]>(`/student/interim_legend?id=${this.studentId}&intake=${intake}`);
    this.mpuLegend$ = this.ws.get<MPULegend[]>(`/student/mpu_legend?id=${this.studentId}&intake=${intake}`);
    this.determinationLegend$ = this.ws.get<DeterminationLegend[]>(`/student/determination_legend?id=${this.studentId}&intake=${intake}`);
    this.classificationLegend$ = this.ws.get<ClassificationLegend[]>(`/student/classification_legend?id=${this.studentId}&intake=${intake}`);
  }

  sortArray(r) {
    let list = [];
    let listItems = [];
    for (let grade of r) {
      list.push(grade.GRADE);
    }
    list.sort();
    listItems = list.filter(function(item, pos) {
      return list.indexOf(item) == pos;
    });

    let a = [],
      prev;

    for (let i = 0; i < list.length; i++) {
      if (list[i] !== prev) {
        a.push(1);
      } else {
        a[a.length - 1]++;
      }
      prev = list[i];
    }

    let randomColor = [
      "rgba(255, 99, 132, 0.7)",
      "rgba(54, 162, 235, 0.7)",
      "rgba(255, 206, 86, 0.7)",
      "rgba(75, 192, 192, 0.7)",
      "rgba(153, 102, 255, 0.7)",
      "rgba(255, 159, 64, 0.7)",
      "rgba(54,72,87,0.7)",
      "rgba(247,89,64,0.7)",
      "rgba(61,199,190,0.7)"
    ];

    let randomBorderColor = [
      "rgba(255,99,132,1)",
      "rgba(54, 162, 235, 1)",
      "rgba(255, 206, 86, 1)",
      "rgba(75, 192, 192, 1)",
      "rgba(153, 102, 255, 1)",
      "rgba(255, 159, 64, 1)",
      "rgba(54,72,87,1)",
      "rgba(247,89,64,1)",
      "rgba(61,199,190,1)"
    ];
    this.showBarChart(listItems, a, randomColor, randomBorderColor);
  }

  showBarChart(listItems, listCount, backgroundColor, borderColor) {
    this.data = {
      labels: listItems,
      datasets: [
        {
          data: listCount,
          backgroundColor: backgroundColor,
          borderColor: borderColor,
          borderWidth: 2
        }
      ]
    };
  }

  showActionSheet() {
    if (this.plt.is('cordova')) {
      const options: ActionSheetOptions = {
        buttonLabels: ['Intakes', ...this.intakeLabels],
        addCancelButtonWithLabel: 'Cancel',
      };
      this.actionSheet.show(options).then((buttonIndex: number) => {
        if (buttonIndex <= 1 + this.intakeLabels.length) {
          this.selectedIntake = this.intakeLabels[buttonIndex - 2] || '';
          this.getResults(this.selectedIntake);
          this.getLegend(this.selectedIntake);
        }
      });
    } else {
      let intakesButton = this.intakeLabels.map(intake => <ActionSheetButton>{
        text: intake,
        handler: () => {
          this.selectedIntake = intake;
          this.getResults(this.selectedIntake);
          this.getLegend(this.selectedIntake);
        }
      });
      let actionSheet = this.actionSheetCtrl.create({
        buttons: [
          {
            text: 'Intakes', handler: () => {

            }
          },
          ...intakesButton, { text: 'Cancel', role: 'cancel' },
        ]
      });
      actionSheet.present();
    }
  }
}
