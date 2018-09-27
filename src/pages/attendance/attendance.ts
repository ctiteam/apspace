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
import { LoadingControllerProvider, WsApiProvider } from '../../providers';

@IonicPage()
@Component({
  selector: 'page-attendance',
  templateUrl: 'attendance.html',
})

export class AttendancePage {

  attendance$: Observable<Attendance[]>;
  courses$: Observable<Course[]>;
  legend$: Observable<AttendanceLegend[]>;

  selectedIntake: string = '';
  studentId: string = '';
  percent: number = 0;
  averageColor: string = '';
  intakeLabels: any;

  numOfSkeletons = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]; // temp solution
  isLoading: boolean;

  constructor(
    private ws: WsApiProvider,
    public loading: LoadingControllerProvider,
    private actionSheet: ActionSheet,
    private plt: Platform,
    public actionSheetCtrl: ActionSheetController,
    public navCtrl: NavController) { }

  showActionSheet() {
    if (this.plt.is('cordova')) {
      const options: ActionSheetOptions = {
        buttonLabels: [...this.intakeLabels],
        addCancelButtonWithLabel: 'Cancel',
      };
      this.actionSheet.show(options).then((buttonIndex: number) => {
        if (buttonIndex <= 1 + this.intakeLabels.length) {
          this.selectedIntake = this.intakeLabels[buttonIndex - 1] || '';
          this.getAttendance(this.selectedIntake);
        }
      });
    } else {
      const intakesButton = this.intakeLabels.map(intake => {
        return {
          text: intake,
          handler: () => {
            this.selectedIntake = intake;
            this.getAttendance(this.selectedIntake);
          },
        } as ActionSheetButton;
      });
      const actionSheet = this.actionSheetCtrl.create({
        buttons: [
          ...intakesButton, { text: 'Cancel', role: 'cancel' },
        ],
      });
      actionSheet.present();
    }
  }

  getAttendance(intake: string, refresh: boolean = false): Observable<Attendance[]> {
    this.isLoading = true;
    const opt = { params: { id: this.studentId, format: 'json' } };
    return this.attendance$ = this.ws.get<Attendance[]>(`/student/attendance?intake=${intake}`, refresh, opt)
      .pipe(
        tap(a => this.calculateAverage(a)),
        finalize(() => this.isLoading = false),
    );
  }

  ionViewDidLoad() {
    this.legend$ = this.ws.get<AttendanceLegend[]>('/student/attendance_legend');
    this.courses$ = this.ws.get<Course[]>('/student/courses').pipe(
      tap(c => this.selectedIntake = c[0].INTAKE_CODE),
      tap(c => this.studentId = c[0].STUDENT_NUMBER),
      tap(_ => this.getAttendance(this.selectedIntake)),
      tap(c => this.intakeLabels = Array.from(new Set((c || []).map(t => t.INTAKE_CODE)))),
    );
  }

  doRefresh(refresher) {
    this.attendance$ = this.getAttendance(this.selectedIntake, true).pipe(
      finalize(() => refresher && refresher.complete()),
    );
  }

  calculateAverage(a: any) {
    let sumOfAttendances = 0;
    if (!a) {
      this.percent = 0;
      this.averageColor = '#f04141';
    } else {
      for (const attendance of a) {
        sumOfAttendances += attendance.PERCENTAGE;
      }
      const averageAttendance = (sumOfAttendances / a.length).toFixed(2);
      this.percent = parseInt(averageAttendance, 10);
      this.averageColor = '#0dbd53';
      if (this.percent < 80) {
        this.averageColor = '#f04141';
      }
    }
  }

  swipe(event) {
    if (event.direction === 2) {
      this.navCtrl.parent.select(3);
    }
    if (event.direction === 4) {
      this.navCtrl.parent.select(1);
    }
  }
}
