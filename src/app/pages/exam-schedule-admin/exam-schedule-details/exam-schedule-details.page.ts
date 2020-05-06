import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController, LoadingController, ModalController, ToastController } from '@ionic/angular';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { ExamScheduleAdmin, IntakeExamSchedule } from 'src/app/interfaces/exam-schedule-admin';
import { WsApiService } from 'src/app/services';
import { AddExamSchedulePage } from '../add-exam-schedule/add-exam-schedule.page';
import { AddIntakePage } from './add-intake/add-intake.page';

@Component({
  selector: 'app-exam-schedule-details',
  templateUrl: './exam-schedule-details.page.html',
  styleUrls: ['./exam-schedule-details.page.scss'],
})

export class ExamScheduleDetailsPage implements OnInit {
  // devUrl = 'https://jeioi258m1.execute-api.ap-southeast-1.amazonaws.com/dev';
  examScheduleDetails$: Observable<any[]>;
  intakes$: Observable<IntakeExamSchedule[]>;

  loading: HTMLIonLoadingElement;

  examScheduleDetailsToBeEdited;
  intakesToBeDeleted: IntakeExamSchedule[] = [];
  intakesToBeValidated = [];

  onDelete = false;
  examId;
  status;

  constructor(
    public modalCtrl: ModalController,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    private route: ActivatedRoute,
    private ws: WsApiService,
  ) {
    this.examId = this.route.snapshot.paramMap.get('examId');
  }

  ngOnInit() {
    this.doRefresh();
  }

  doRefresh() {
    this.intakesToBeValidated = [];

    this.examScheduleDetails$ = this.ws.get<ExamScheduleAdmin>(`/exam/exam_details?exam_id=${this.examId}`).pipe(
      tap(examScheduleDetails => {
        this.examScheduleDetailsToBeEdited = examScheduleDetails;
        this.status = this.examScheduleDetailsToBeEdited.STATUS;
      }),
      map(examScheduleDetails =>
        [
          {
            title: 'Module',
            detail: examScheduleDetails.MODULE
          },
          {
            title: 'Date',
            detail: moment(examScheduleDetails.DATEDAY).format('DD-MMM-YYYY').toUpperCase()
          },
          {
            title: 'Time',
            detail: examScheduleDetails.TIME
          },
          {
            title: 'Publication',
            detail: `${moment(examScheduleDetails.FROMDATE).format('DD-MMM-YYYY').toUpperCase()} - ${moment(examScheduleDetails.TILLDATE).format('DD-MMM-YYYY').toUpperCase()}`
          },
          {
            title: 'Assessment Type',
            detail: examScheduleDetails.ASSESSMENT_TYPE
          },
          {
            title: 'Remarks',
            detail: examScheduleDetails.REMARKS
          }
        ]
      )
    );

    this.intakes$ = this.ws.get<IntakeExamSchedule[]>(`/exam/intake_details?exam_id=${this.examId}`).pipe(
      tap(intakesDetails => intakesDetails.forEach(intakeDetails => this.intakesToBeValidated.push(intakeDetails.INTAKE)))
    );
  }

  toggleBulkDeleteIntake() {
    this.onDelete = !this.onDelete;
  }

  addSelectedIntake(selectedIntake: IntakeExamSchedule) {
    if (!(this.intakesToBeDeleted.find(intake => intake.ENTRYID === selectedIntake.ENTRYID))) {
      this.intakesToBeDeleted.push(selectedIntake);
    } else {
      this.intakesToBeDeleted.forEach((intake, index, intakesToBeDeleted) => {
        if (intake.ENTRYID === selectedIntake.ENTRYID) {
          intakesToBeDeleted.splice(index, 1);
        }
      });
    }
  }

  resetSelectedIntake(intakes) {
    const intakesKeys = Object.keys(intakes);
    intakesKeys.forEach(intakeKey => delete intakes[intakeKey].isChecked);

    this.intakesToBeDeleted = [];
  }

  deleteSelectedIntakes() {
    if (this.intakesToBeDeleted) {
      const bodyObject = {
        'entries[]' : []
      };

      this.intakesToBeDeleted.forEach(intake => {
        bodyObject['entries[]'].push(intake.ENTRYID);
      });

      this.alertCtrl.create({
        header: 'Warning',
        subHeader: 'You have intakes that you\'re about to delete. Do you want to continue?',
        buttons: [
          {
            text: 'No',
            role: 'cancel',
            handler: () => {}
          },
          {
            text: 'Yes',
            handler: () => {
              this.presentLoading();
              const body = new HttpParams({ fromObject: { ...bodyObject } }).toString();
              const headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
              this.ws.post('/exam/remove_entry', { body, headers }).subscribe({
                next: () => {
                  this.showToastMessage(
                    'Intakes deleted successfully!',
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
                  this.intakesToBeDeleted = [];
                  this.toggleBulkDeleteIntake();
                  this.dismissLoading().then(() => this.doRefresh());
                }
              });
            }
          }
        ]
      }).then(alert => alert.present());
    }
  }

  async editExamSchedule() {
    const modal = await this.modalCtrl.create({
      component: AddExamSchedulePage,
      componentProps: {
        onEdit: 'true',
        examScheduleDetails: this.examScheduleDetailsToBeEdited
      },
      cssClass: 'full-page-modal'
    });

    modal.onDidDismiss().then((data) => {
      if (data.data !== null) {
        this.doRefresh();
      }
    });

    return await modal.present();
  }

  async addNewIntake() {
    const modal = await this.modalCtrl.create({
      component: AddIntakePage,
      componentProps: {
        examId: this.examId,
        intakesToBeValidated: this.intakesToBeValidated
      },
      cssClass: 'full-page-modal'
    });

    modal.onDidDismiss().then((data) => {
      if (data.data !== null) {
        this.doRefresh();
      }
    });

    return await modal.present();
  }

  async editIntake(intakeDetails: IntakeExamSchedule) {
    const filteredIntakesToBeValidated = this.intakesToBeValidated.filter(intake => intake !== intakeDetails.INTAKE);

    const modal = await this.modalCtrl.create({
      component: AddIntakePage,
      componentProps: {
        onEdit: 'true',
        intakeDetails,
        examId: this.examId,
        intakesToBeValidated: filteredIntakesToBeValidated
      },
      cssClass: 'full-page-modal'
    });

    modal.onDidDismiss().then((data) => {
      if (data.data !== null) {
        this.doRefresh();
      }
    });

    return await modal.present();
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

  showToastMessage(message: string, color: 'danger' | 'success') {
    this.toastCtrl
      .create({
        message,
        duration: 5000,
        position: 'top',
        color,
        showCloseButton: true,
        animated: true
      })
      .then(toast => toast.present());
  }

  activateExamSchedule() {
    const bodyObject = {
      exam_id: this.examId,
      status: this.status === 'Inactive' ? 'Active' : 'Inactive'
    };

    this.alertCtrl.create({
      header: `Change Exam Schedule Status`,
      subHeader: `Are you sure you would like to proceed changing the status?`,
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {}
        },
        {
          text: 'Yes',
          handler: () => {
            this.presentLoading();
            const body = new HttpParams({ fromObject: { ...bodyObject } }).toString();
            const headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
            this.ws.post('/exam/update_exam_schedule_status', { body, headers }).subscribe({
              next: () => {
                this.showToastMessage(
                  'Status successfully changed!',
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
                this.dismissLoading().then(() => this.doRefresh());
              }
            });
          }
        }
      ]
    }).then(alertCancelBooked => alertCancelBooked.present());
  }
}
