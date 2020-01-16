import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { APLCClass, APLCClassDescription, APLCStudentBehaviour, APLCSubject } from 'src/app/interfaces';
import { WsApiService } from 'src/app/services';

@Component({
  selector: 'app-update-progress-report',
  templateUrl: './update-progress-report.page.html',
  styleUrls: ['./update-progress-report.page.scss'],
})
export class UpdateProgressReportPage implements OnInit {
  subjects$: Observable<APLCSubject[]>;
  classes$: Observable<APLCClass[]>;
  scoreLegend$: Observable<any>; // Keys are dynamic
  descriptionLegend$: Observable<any>; // Keys are dynamic
  classDescription$: Observable<APLCClassDescription[]>;
  studentsBehaviour$: Observable<APLCStudentBehaviour[]>;
  courses$: Observable<any>; // response returns 500  > to be modified later

  loading: HTMLIonLoadingElement;
  skeletons = new Array(6);
  searchByCourseCode = false;
  subjectCode: string;
  classCode: string;
  courseCode: string;
  scores = [1, 2, 3];

  constructor(
    private ws: WsApiService,
    private alertCtrl: AlertController,
    private loadingController: LoadingController,
    private toastCtrl: ToastController
  ) { }

  ngOnInit() {
    this.initData();
  }

  initData() { // changed with refresher
    this.subjects$ = this.ws.get<any>(`/aplc/subjects`);
    this.scoreLegend$ = this.ws.get<any[]>(`/aplc/score-legend`, { caching: 'cache-only' });
    this.descriptionLegend$ = this.ws.get<any[]>(`/aplc/description-legend`, { caching: 'cache-only' });
  }

  onToggleChanged() {
    if (this.searchByCourseCode) {
      this.courses$ = this.ws.get<any>(`/aplc/courses`).pipe(
        tap(_ => this.classCode = ''),
        tap(_ => this.subjectCode = '')
      );
    } else {
      this.subjects$ = this.ws.get<any>(`/aplc/subjects`).pipe(
        tap(_ => this.classCode = ''),
        tap(_ => this.courseCode = '')
      );
    }
  }

  getClassesBySubjectCode() {
    this.classes$ = this.ws.get<any>(`/aplc/classes?subject_code=${this.subjectCode}`).pipe(
      tap(_ => this.classCode = ''),
      tap(_ => this.courseCode = '')
    );
  }

  getClassesByCourseCode() {
    this.classes$ = this.ws.get<any>(`/aplc/classes?course_code=${this.courseCode}`).pipe(
      tap(_ => this.classCode = ''),
      tap(_ => this.subjectCode = '')
    );
  }

  onClassCodeChange() {
    this.classDescription$ = this.ws.get<any>(`/aplc/class-description?class_code=${this.classCode}`);
    this.studentsBehaviour$ = this.ws.get<any>(`/aplc/student-behavior?class_code=${this.classCode}`);
  }


  submit(studentBehaviors: any[]) {
    this.alertCtrl.create({
      header: 'Confirm!',
      subHeader: 'You are about to update the students\' behaviors. Do you want to continue?',
      buttons: [
        {
          text: 'No',
          handler: () => { }
        },
        {
          text: 'Yes',
          handler: () => {
            // START THE LOADING
            this.presentLoading();
            this.ws.put<any>('/aplc/student-behavior', {
              body: studentBehaviors
            }).subscribe(
              {
                next: _ => {
                  this.showToastMessage('Student behaviors has been updated successfully!', 'success');
                },
                error: _ => {
                  this.showToastMessage('Something went wrong! please try again or contact us via the feedback page', 'danger');
                },
                complete: () => {
                  this.dismissLoading();
                  this.initData();
                }
              }
            );
          }
        }
      ]
    }).then(confirm => confirm.present());
  }

  async presentLoading() {
    this.loading = await this.loadingController.create({
      spinner: 'dots',
      duration: 5000,
      message: 'Please wait...',
      translucent: true,
    });
    return await this.loading.present();
  }

  async dismissLoading() {
    return await this.loading.dismiss();
  }

  showToastMessage(message: string, color: 'danger' | 'success') {
    this.toastCtrl.create({
      message,
      duration: 6000,
      position: 'top',
      color,
      showCloseButton: true,
      animated: true,
      // enterAnimation: toastMessageEnterAnimation,
      // leaveAnimation: toastMessageLeaveAnimation
    }).then(toast => toast.present());
  }

}
