import { Component } from '@angular/core';
import { ActionSheet, ActionSheetOptions } from '@ionic-native/action-sheet';
import {
  ActionSheetButton,
  ActionSheetController,
  IonicPage,
  NavController,
  Platform,
} from 'ionic-angular';

import { Observable } from 'rxjs/Observable';
import { finalize, tap } from 'rxjs/operators';

import { Attendance, AttendanceLegend, Course } from '../../interfaces';
import { WsApiProvider } from '../../providers';

@IonicPage()
@Component({
  selector: 'page-attendance',
  templateUrl: 'attendance.html',
})
export class AttendancePage {
  objectKeys = Object.keys; /** bindings for template */

  attendance$: Observable<Attendance[]>;
  courses$: Observable<Course[]>;
  legend$: Observable<AttendanceLegend>;

  selectedIntake: string = '';
  average: number;
  averageColor: string = '';
  intakeLabels: any;

  numOfSkeletons = new Array(5);
  isLoading: boolean;

  constructor(
    private ws: WsApiProvider,
    private actionSheet: ActionSheet,
    private plt: Platform,
    public actionSheetCtrl: ActionSheetController,
    public navCtrl: NavController,
  ) {}

  showActionSheet() {
    if (this.plt.is('cordova')) {
      const options: ActionSheetOptions = {
        buttonLabels: [...this.intakeLabels],
        addCancelButtonWithLabel: 'Cancel',
      };
      this.actionSheet.show(options).then((buttonIndex: number) => {
        if (buttonIndex <= 1 + this.intakeLabels.length) {
          this.selectedIntake = this.intakeLabels[buttonIndex - 1] || '';
          this.attendance$ = this.getAttendance(this.selectedIntake);
        }
      });
    } else {
      const intakesButton = this.intakeLabels.map(intake => {
        return {
          text: intake,
          handler: () => {
            this.selectedIntake = intake;
            this.attendance$ = this.getAttendance(this.selectedIntake);
          },
        } as ActionSheetButton;
      });
      const actionSheet = this.actionSheetCtrl.create({
        buttons: [...intakesButton, { text: 'Cancel', role: 'cancel' }],
      });
      actionSheet.present();
    }
  }

  getAttendance(intake: string, refresh?: boolean): Observable<Attendance[]> {
    this.average = -2;
    return (this.attendance$ = this.ws
      .get<Attendance[]>(`/student/attendance?intake=${intake}`, refresh)
      .pipe(
        tap(_ => this.getLegend(refresh)),
        tap(a => this.calculateAverage(a)),
      ));
  }

  getLegend(refresh: boolean) {
    this.legend$ = this.ws.get<AttendanceLegend>(
      '/student/attendance_legend',
      refresh,
    );
  }

  calculateAverage(aa: Attendance[] | null) {
    if (!Array.isArray(aa)) {
      return;
    }
    if(aa.length > 0){
      let totalClasses = aa.reduce((a, b) => a + b.TOTAL_CLASSES, 0);
      let totalAbsentClasses = aa.reduce((a, b) => a + b.TOTAL_ABSENT, 0);
      let totalAttendedClasses = totalClasses - totalAbsentClasses;
      
      this.average = (totalAttendedClasses / totalClasses);
    }
    else{
      this.average = -1;
    }
  }

  ionViewDidLoad() {
    this.doRefresh();
  }

  doRefresh(refresher?) {
    this.courses$ = this.ws.get<Course[]>('/student/courses', true).pipe(
      tap(c => (this.selectedIntake = c[0].INTAKE_CODE)),
      tap(_ => this.attendance$ = this.getAttendance(this.selectedIntake, true)),
      tap(
        c =>
          (this.intakeLabels = Array.from(
            new Set((c || []).map(t => t.INTAKE_CODE)),
          )),
      ),
      finalize(() => refresher && refresher.complete())
    );
  }
}
