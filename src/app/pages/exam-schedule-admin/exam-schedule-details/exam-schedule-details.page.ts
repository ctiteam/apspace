import { Component, OnInit } from '@angular/core';

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
      detail: 'testing'
    },
    {
      title: 'DateTime',
      detail: 'testing'
    },
    {
      title: 'Publication',
      detail: 'testing'
    },
    {
      title: 'Remarks',
      detail: 'testing'
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
  onEdit = false;

  constructor() { }

  ngOnInit() {
  }

  toggleEditIntake() {
    this.onEdit = !this.onEdit;
  }
}
