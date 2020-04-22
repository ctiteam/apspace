import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AddExamSchedulePage } from '../add-exam-schedule/add-exam-schedule.page';
import { AddIntakePage } from './add-intake/add-intake.page';

interface ExamScheduleDetails {
  title: string;
  detail: string;
}

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
  examScheduleDetails: ExamScheduleDetails[] = [
    {
      title: 'Module',
      detail: 'CT001-3-2'
    },
    {
      title: 'Date',
      detail: '19-Sep-2019'
    },
    {
      title: 'Time',
      detail: '11:00 AM - 1:00AM'
    },
    {
      title: 'Publication',
      detail: '19-Sep-2019 - 20-Sep-2019'
    },
    {
      title: 'Remarks',
      detail: 'Lorem Ispum'
    },
  ];

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

  constructor(public modalCtrl: ModalController) { }

  ngOnInit() {
  }

  toggleBulkDeleteIntake() {
    this.onDelete = !this.onDelete;
  }

  editExamSchedule() {
    this.modalCtrl.create({
      component: AddExamSchedulePage,
      componentProps: {
        edit: 'true'
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
        edit: 'true'
      },
      cssClass: 'full-page-modal'
    }).then(modal => modal.present());
  }
}
