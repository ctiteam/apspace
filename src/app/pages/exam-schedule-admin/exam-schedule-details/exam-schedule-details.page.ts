import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController, ModalController, ToastController } from '@ionic/angular';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { ExamScheduleAdmin } from 'src/app/interfaces/exam-schedule-admin';
import { WsApiService } from 'src/app/services';
import { AddExamSchedulePage } from '../add-exam-schedule/add-exam-schedule.page';
import { AddIntakePage } from './add-intake/add-intake.page';

interface Intake {
  intake: string;
  type: string;
  venue: string;
  docketsIssuance: string;
  resultDate: string;
}

@Component({
  selector: 'app-exam-schedule-details',
  templateUrl: './exam-schedule-details.page.html',
  styleUrls: ['./exam-schedule-details.page.scss'],
})

export class ExamScheduleDetailsPage implements OnInit {
  devUrl = 'https://jeioi258m1.execute-api.ap-southeast-1.amazonaws.com/dev';
  examScheduleDetails$: Observable<any[]>;
  examScheduleDetailsToBeEdited;

  intakes: Intake[] = [
    {
      intake: 'UCPP1702MGMT',
      type: 'First',
      venue: '1, APIIT@TPM',
      docketsIssuance: '2020-02-04',
      resultDate: '2020-02-13'
    },
    {
      intake: 'AFCF1805AS',
      type: 'First',
      venue: '1, APIIT@TPM',
      docketsIssuance: '2020-02-04',
      resultDate: '2020-02-13'
    },
    {
      intake: 'UC1F1904HRM',
      type: 'First',
      venue: '1, APIIT@TPM',
      docketsIssuance: '2020-02-04',
      resultDate: '2020-02-13'
    },
    {
      intake: 'UCPP1702MGMT',
      type: 'First',
      venue: '1, APIIT@TPM',
      docketsIssuance: '2020-02-04',
      resultDate: '2020-02-13'
    },
    {
      intake: 'UCPP1702MGMT',
      type: 'First',
      venue: '1, APIIT@TPM',
      docketsIssuance: '2020-02-04',
      resultDate: '2020-02-13'
    },
    {
      intake: 'AFCF1805AS',
      type: 'First',
      venue: '1, APIIT@TPM',
      docketsIssuance: '2020-02-04',
      resultDate: '2020-02-13'
    },
    {
      intake: 'UC1F1904HRM',
      type: 'First',
      venue: '1, APIIT@TPM',
      docketsIssuance: '2020-02-04',
      resultDate: '2020-02-13'
    },
    {
      intake: 'UCPP1702MGMT',
      type: 'First',
      venue: '1, APIIT@TPM',
      docketsIssuance: '2020-02-04',
      resultDate: '2020-02-13'
    },
    {
      intake: 'UCPP1702MGMT',
      type: 'First',
      venue: '1, APIIT@TPM',
      docketsIssuance: '2020-02-04',
      resultDate: '2020-02-13'
    },
    {
      intake: 'AFCF1805AS',
      type: 'First',
      venue: '1, APIIT@TPM',
      docketsIssuance: '2020-02-04',
      resultDate: '2020-02-13'
    },
    {
      intake: 'UC1F1904HRM',
      type: 'First',
      venue: '1, APIIT@TPM',
      docketsIssuance: '2020-02-04',
      resultDate: '2020-02-13'
    },
    {
      intake: 'UCPP1702MGMT',
      type: 'First',
      venue: '1, APIIT@TPM',
      docketsIssuance: '2020-02-04',
      resultDate: '2020-02-13'
    },
  ];

  status = 'Inactive';
  onDelete = false;

  examId;

  constructor(
    public modalCtrl: ModalController,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    private route: ActivatedRoute,
    private ws: WsApiService
  ) {
    this.examId = this.route.snapshot.paramMap.get('examId');
  }

  ngOnInit() {
    this.doRefresh();
  }

  doRefresh() {
    this.examScheduleDetails$ = this.ws.get<ExamScheduleAdmin>(`/exam/exam_details?exam_id=${this.examId}`, {url: this.devUrl}).pipe(
      tap(examScheduleDetails => this.examScheduleDetailsToBeEdited = examScheduleDetails),
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
            title: 'Remarks',
            detail: examScheduleDetails.REMARKS
          },
        ]
      )
    );
  }

  toggleBulkDeleteIntake() {
    this.onDelete = !this.onDelete;
  }

  editExamSchedule() {
    this.modalCtrl.create({
      component: AddExamSchedulePage,
      componentProps: {
        onEdit: 'true',
        examScheduleDetails: this.examScheduleDetailsToBeEdited
      },
      cssClass: 'full-page-modal'
    }).then(modal => modal.present());
  }

  addNewIntake() {
    this.modalCtrl.create({
      component: AddIntakePage,
      cssClass: 'full-page-modal'
    }).then(modal => modal.present());
  }

  editIntake() {
    this.modalCtrl.create({
      component: AddIntakePage,
      componentProps: {
        onEdit: 'true'
      },
      cssClass: 'full-page-modal'
    }).then(modal => modal.present());
  }

  showToastMessage(message, duration, color) {
    this.toastCtrl.create({
      message,
      duration,
      color,
      position: 'top'
    }).then(toast => toast.present());
  }

  activateExamSchedule() {
    this.alertCtrl.create({
      header: 'Activate Exam Schedule',
      subHeader: 'To confirm activate the following exam schedule, type "yes" at the bottom input field.',
      inputs: [
        {
          name: 'activateConfirmation',
          type: 'text',
          placeholder: 'Type "yes" to proceed.',
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {}
        },
        {
          text: 'Submit',
          handler: (data) => {
            if (data.activateConfirmation.toUpperCase() === 'YES') {
              this.showToastMessage(
                'Activation Success!',
                3000,
                'success'
              );
            } else {
              this.showToastMessage(
                'The input is incorrect. Activation Failed.',
                3000,
                'danger'
              );
            }
          }
        }
      ]
    }).then(alertCancelBooked => alertCancelBooked.present());
  }
}
