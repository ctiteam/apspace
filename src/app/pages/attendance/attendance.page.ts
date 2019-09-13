import { Component, OnInit } from '@angular/core';
import { WsApiService } from 'src/app/services';
import { Platform, ActionSheetController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { Attendance, Course, AttendanceLegend } from 'src/app/interfaces';
import { tap, finalize } from 'rxjs/operators';
import { ActionSheetButton } from '@ionic/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.page.html',
  styleUrls: ['./attendance.page.scss'],
})
export class AttendancePage implements OnInit {

  attendance$: Observable<Attendance[]>;
  course$: Observable<Course[]>;
  legend$: Observable<AttendanceLegend>;

  selectedIntake = '';
  average: number;
  averageColor = '';
  intakeLabels: any;

  isLoading: boolean;

  constructor(
    private ws: WsApiService,
    private plt: Platform,
    public actionSheetCtrl: ActionSheetController,
    private router: Router,
  ) { }

  ngOnInit() {
    this.doRefresh();
  }

  doRefresh(refresher?) {
    this.course$ = this.ws.get<Course[]>('/student/courses', refresher).pipe(
      tap(c => (this.selectedIntake = c[0].INTAKE_CODE)),
      tap(_ => this.attendance$ = this.getAttendance(this.selectedIntake, refresher)),
      tap(
        c =>
          (this.intakeLabels = Array.from(
            new Set((c || []).map(t => t.INTAKE_CODE)),
          )),
      ),
      finalize(() => refresher && refresher.target.complete())
    );
  }

  showActionSheet() {

    const intakesButton = this.intakeLabels.map(intake => {
      return {
        text: intake,
        handler: () => {
          this.selectedIntake = intake;
          this.attendance$ = this.getAttendance(this.selectedIntake);
        },
      } as ActionSheetButton;
    });

    this.actionSheetCtrl.create({
      buttons: [...intakesButton, { text: 'Cancel', role: 'cancel' }],
    }).then(
      actionSheet => actionSheet.present()
    );

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
    if (aa.length > 0) {
      const totalClasses = aa.reduce((a, b) => a + b.TOTAL_CLASSES, 0);
      const totalAbsentClasses = aa.reduce((a, b) => a + b.TOTAL_ABSENT, 0);
      const totalAttendedClasses = totalClasses - totalAbsentClasses;

      this.average = (totalAttendedClasses / totalClasses);
    } else {
      this.average = -1;
    }
  }

  comingFromTabs() {
    if (this.router.url.split('/')[1].split('/')[0] === 'tabs') {
      return true;
    }
    return false;
  }
}
