import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActionSheetController } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { ActionSheetButton } from '@ionic/core';
import { Observable } from 'rxjs';
import { finalize, map, tap } from 'rxjs/operators';
import { Attendance, AttendanceLegend, Course } from 'src/app/interfaces';
import { WsApiService } from 'src/app/services';
import { AttendanceDetailsModalPage } from './attendance-details-modal/attendance-details-modal';

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.page.html',
  styleUrls: ['./attendance.page.scss'],
})
export class AttendancePage implements OnInit {
  indecitor = false;
  attendance$: Observable<any[]>;
  course$: Observable<Course[]>;
  legend$: Observable<AttendanceLegend>;

  selectedIntake = '';
  average: number;
  averageColor = '';
  intakeLabels: any;

  isLoading: boolean;

  constructor(
    private ws: WsApiService,
    public actionSheetCtrl: ActionSheetController,
    private router: Router,
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {
    this.indecitor = true;
  }

  ionViewDidEnter() {
    /*
    * The page's response is very huge, which is causing issues on ios if we use oninit
    * the indecitor is used to define if the page should call the dorefresh of not
    * If we do not use the indecitor, the page in the tabs (tabs/attendance) will be reloading every time we enter the tab
    */
    if (this.indecitor) {
      this.doRefresh();
      this.indecitor = false;
    }
  }

  doRefresh(refresher?) {
    this.course$ = this.ws.get<Course[]>('/student/courses', { caching: 'network-or-cache' }).pipe(
      tap(c => (this.selectedIntake = c[0].INTAKE_CODE)),
      tap(_ => this.attendance$ = this.getAttendance(this.selectedIntake)),
      tap(
        c =>
          (this.intakeLabels = Array.from(
            new Set((c || []).map(t => t.INTAKE_CODE)),
          )),
      ),
      tap(_ => this.getLegend(refresher)),
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

  getAttendance(intake: string): Observable<any[]> {
    this.average = -2;
    const url = `/student/attendance?intake=${intake}`;
    return (this.attendance$ = this.ws.get<Attendance[]>(url, { caching: 'network-or-cache' }).pipe(
      tap(a => this.calculateAverage(a)),
      map(res => this.groupAttendanceBySemester(res)),
    ));
  }

  groupAttendanceBySemester(attendance: any) {
    const attendancePerSemester = attendance
      .reduce((previous: any, current: any) => {
        if (!previous[current.SEMESTER]) {
          previous[current.SEMESTER] = [current];
        } else {
          previous[current.SEMESTER].push(current);
        }
        return previous;
      }, {});
    return Object.keys(attendancePerSemester).map(semester => ({ semester, value: attendancePerSemester[semester] }));
  }

  getLegend(refresh: boolean) {
    const caching = refresh ? 'network-or-cache' : 'cache-only';
    this.legend$ = this.ws.get<AttendanceLegend>('/student/attendance_legend', { caching });
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

  async attendanceDetails(moduleName: string, intakeCode: string, moduleCode: string ) {
    const modal = await this.modalCtrl.create({
      component: AttendanceDetailsModalPage,
      componentProps: {
        title: moduleName,
        intake: intakeCode,
        module: moduleCode
      },
      cssClass: 'attendanceDetailsModal'
    });
    await modal.present();
  }

  comingFromTabs() {
    if (this.router.url.split('/')[1].split('/')[0] === 'tabs') {
      return true;
    }
    return false;
  }
}
