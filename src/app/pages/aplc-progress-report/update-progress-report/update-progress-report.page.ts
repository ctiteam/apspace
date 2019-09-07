import { Component, OnInit } from '@angular/core';
import { WsApiService } from 'src/app/services';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-update-progress-report',
  templateUrl: './update-progress-report.page.html',
  styleUrls: ['./update-progress-report.page.scss'],
})
export class UpdateProgressReportPage implements OnInit {
  stagingUrl = 'https://kh1rvo4ilf.execute-api.ap-southeast-1.amazonaws.com/dev/aplc';

  subjects$: Observable<any>; // to create interface
  classes$: Observable<any>; // to create interface
  scoreLegend$: Observable<any>; // to create interface
  descriptionLegend$: Observable<any>; // to create interface
  classDescription$: Observable<any>;
  studentsBehaviour$: Observable<any>;
  courses$: Observable<any>;

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
    this.subjects$ = this.ws.get<any>(`/subjects`, true, { url: this.stagingUrl });
    this.scoreLegend$ = this.ws.get<any[]>(`/score-legend`, false, { url: this.stagingUrl });
    this.descriptionLegend$ = this.ws.get<any[]>(`/description-legend`, false, { url: this.stagingUrl });
  }

  onToggleChanged() {
    if (this.searchByCourseCode) {
      this.courses$ = this.ws.get<any>(`/courses`, true, { url: this.stagingUrl }).pipe(
        tap(_ => this.classCode = ''),
        tap(_ => this.subjectCode = '')
      );
    } else {
      this.subjects$ = this.ws.get<any>(`/subjects`, true, { url: this.stagingUrl }).pipe(
        tap(_ => this.classCode = ''),
        tap(_ => this.courseCode = '')
      );
    }
  }

  getClassesBySubjectCode() {
    this.classes$ = this.ws.get<any>(`/classes?subject_code=${this.subjectCode}`, true, { url: this.stagingUrl }).pipe(
      tap(_ => this.classCode = ''),
      tap(_ => this.courseCode = '')
    );
  }

  getClassesByCourseCode() {
    this.classes$ = this.ws.get<any>(`/classes?course_code=${this.courseCode}`, true, { url: this.stagingUrl }).pipe(
      tap(_ => this.classCode = ''),
      tap(_ => this.subjectCode = '')
    );
  }

  onClassCodeChange() {
    this.classDescription$ = this.ws.get<any>(`/class-description?class_code=${this.classCode}`, true, { url: this.stagingUrl });
    this.studentsBehaviour$ = this.ws.get<any>(`/student-behavior?class_code=${this.classCode}`, true, { url: this.stagingUrl });
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
            this.ws.put<any>('/student-behavior', {
              body: studentBehaviors,
              url: this.stagingUrl
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
