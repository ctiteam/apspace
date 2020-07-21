import { HttpParams } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController, ModalController, ToastController } from '@ionic/angular';
import * as moment from 'moment';
import { Observable, Subscription } from 'rxjs';
import { finalize, shareReplay, tap } from 'rxjs/operators';

import { SearchModalComponent } from 'src/app/components/search-modal/search-modal.component';
import { ExamScheduleAdmin, ResitExamSchedule } from 'src/app/interfaces/exam-schedule-admin';
import { WsApiService } from 'src/app/services';
import { NotifierService } from 'src/app/shared/notifier/notifier.service';
import { AddExamSchedulePage } from './add-exam-schedule/add-exam-schedule.page';

@Component({
  selector: 'app-exam-schedule-admin',
  templateUrl: './exam-schedule-admin.page.html',
  styleUrls: ['./exam-schedule-admin.page.scss'],
})

export class ExamScheduleAdminPage implements OnInit, OnDestroy {
  loading: HTMLIonLoadingElement;

  examScheduleListOptions = [
    'Exam Schedule',
    'Resits'
  ];

  examSchedules$: Observable<ExamScheduleAdmin[]>;
  pastExamSchedules$: Observable<ExamScheduleAdmin[]>;
  resitExamSchedules$: Observable<ResitExamSchedule[]>;
  notification: Subscription;

  onDelete = false;
  isPast = false;
  selectedExamScheduleOption = 'Exam Schedule';
  selectedIntakeForResit = '';

  examScheduleToBeDeleted: ExamScheduleAdmin[] = [];
  intakes = [];

  // devUrl = 'https://jeioi258m1.execute-api.ap-southeast-1.amazonaws.com/dev';

  constructor(
    public toastCtrl: ToastController,
    public router: Router,
    public modalCtrl: ModalController,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    private ws: WsApiService,
    private notifierService: NotifierService
  ) { }

  ngOnInit() {
    this.doRefresh();

    this.notification = this.notifierService.examScheduleUpdated.subscribe(data => {
      if (data && data === 'SUCCESS') {
        this.doRefresh();
      }
    });
  }

  ngOnDestroy() {
    this.notification.unsubscribe();
  }

  doRefresh(refresher?) {
    this.examSchedules$ = this.ws.get<ExamScheduleAdmin[]>('/exam/current_exam').pipe(
      shareReplay(1)
    );

    const lastYear = moment(new Date()).subtract(1, 'years').format('YYYY');

    this.pastExamSchedules$ = this.ws.get<ExamScheduleAdmin[]>(`/exam/past_exam?year=${lastYear}`).pipe(
      shareReplay(1)
    );

    this.ws.get<any>('/exam/intake_listing').pipe(
      tap(intakes => {
        intakes.forEach(intake => this.intakes.push(intake.COURSE_CODE_ALIAS));
      }),
      finalize(() => refresher && refresher.target.complete())
    ).subscribe();
  }

  doRefreshResit(selectedIntake) {
    const headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
    this.resitExamSchedules$ = this.ws.get<ResitExamSchedule[]>(
      `/exam/resit_exam_schedule_by_intake?intake=${selectedIntake}&types=Resit`, { headers }
    ).pipe(
      shareReplay(1)
    );
  }

  async presentIntakeSearch() {
    const modal = await this.modalCtrl.create({
      component: SearchModalComponent,
      componentProps: {
        items: this.intakes,
        notFound: 'No intake selected'
      }
    });

    modal.onDidDismiss().then((data) => {
      if (data.data) {
        this.selectedIntakeForResit = data.data.item;
        this.doRefreshResit(this.selectedIntakeForResit);
      }
    });

    return await modal.present();
  }

  addSelectedExamSchedule(selectedExamSchedule: ExamScheduleAdmin) {
    if (!(this.examScheduleToBeDeleted.find(examSchedule => examSchedule.EXAMID === selectedExamSchedule.EXAMID))) {
      this.examScheduleToBeDeleted.push(selectedExamSchedule);
    } else {
      this.examScheduleToBeDeleted.forEach((examSchedule, index, examScheduleToBeDeleted) => {
        if (examSchedule.EXAMID === selectedExamSchedule.EXAMID) {
          examScheduleToBeDeleted.splice(index, 1);
        }
      });
    }
  }

  resetSelectedExamSchedule(examSchedules) {
    const examSchedulesKeys = Object.keys(examSchedules);
    examSchedulesKeys.forEach(examScheduleKeys => delete examSchedules[examScheduleKeys].isChecked);

    this.examScheduleToBeDeleted = [];
  }

  deleteSelectedExamSchedule() {
    if (this.examScheduleToBeDeleted) {
      const bodyObject = {
        'exam_id[]': []
      };

      this.examScheduleToBeDeleted.forEach(examSchedule => {
        bodyObject['exam_id[]'].push(examSchedule.EXAMID);
      });

      this.alertCtrl.create({
        header: 'Warning',
        subHeader: 'You have exam schedules that you\'re about to delete. Do you want to continue?',
        buttons: [
          {
            text: 'No',
            role: 'cancel',
            handler: () => { }
          },
          {
            text: 'Yes',
            handler: () => {
              this.presentLoading();
              const body = new HttpParams({ fromObject: { ...bodyObject } }).toString();
              const headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
              this.ws.post('/exam/delete_exam_schedule', { body, headers }).subscribe({
                next: () => {
                  this.showToastMessage(
                    'Exam Schedule deleted successfully!',
                    'success'
                  );
                },
                error: (err) => {
                  this.dismissLoading();
                  this.showToastMessage(
                    err.status + ': ' + err.error.error,
                    'danger'
                  );
                },
                complete: () => {
                  this.examScheduleToBeDeleted = [];
                  this.toggleRemoveExamSchedule();
                  this.dismissLoading().then(() => this.doRefresh());
                }
              });
            }
          }
        ]
      }).then(alert => alert.present());
    }
  }

  async addNewExamSchedule() {
    const modal = await this.modalCtrl.create({
      component: AddExamSchedulePage,
      cssClass: 'full-page-modal'
    });

    modal.onDidDismiss().then((data) => {
      if (data.data !== null) {
        this.doRefresh();
      }
    });

    return await modal.present();
  }

  showToastMessage(message: string, color: 'danger' | 'success') {
    this.toastCtrl.create({
      message,
      duration: 7000,
      position: 'top',
      color,
      animated: true,
      buttons: [
        {
          text: 'Close',
          role: 'cancel'
        }
      ]
    }).then(toast => toast.present());
  }

  async presentLoading() {
    this.loading = await this.loadingCtrl.create({
      spinner: 'dots',
      duration: 5000,
      message: 'Please wait...',
      translucent: true
    });
    return await this.loading.present();
  }

  async dismissLoading() {
    return await this.loading.dismiss();
  }

  toggleRemoveExamSchedule() {
    this.onDelete = !this.onDelete;
  }

  toggleExamView() {
    this.isPast = !this.isPast;
  }

  viewExamScheduleDetails(examId) {
    this.router.navigate(['exam-schedule-details', examId], { replaceUrl: false });
  }

  segmentChanged(event) {
    this.selectedExamScheduleOption = event.detail.value;
  }
}
