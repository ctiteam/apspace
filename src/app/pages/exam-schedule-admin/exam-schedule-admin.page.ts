import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

interface ExamSchedule {
  module: string;
  dateTime: string;
  publicationDate: string;
  createdBy: string;
  status: string;
}

@Component({
  selector: 'app-exam-schedule-admin',
  templateUrl: './exam-schedule-admin.page.html',
  styleUrls: ['./exam-schedule-admin.page.scss'],
})

export class ExamScheduleAdminPage implements OnInit {
  examScheduleListOptions = [
    'Exam Schedule',
    'Resits'
  ];

  examSchedules: ExamSchedule[] = [
    {
      module: 'CT001-3-2',
      dateTime: '19-Sep-2019, 11:00 AM - 1:00AM',
      publicationDate: '19-Sep-2019 - 20-Sep-2019',
      createdBy: 'MUSTAFA',
      status: 'Inactive'
    },
    {
      module: 'CT022-3-2',
      dateTime: '19-Sep-2019, 11:00 AM - 1:00AM',
      publicationDate: '19-Sep-2019 - 20-Sep-2019',
      createdBy: 'MUSTAFA',
      status: 'Active'
    },
    {
      module: 'CT001-3-2',
      dateTime: '19-Sep-2019, 11:00 AM - 1:00AM',
      publicationDate: '19-Sep-2019 - 20-Sep-2019',
      createdBy: 'MUSTAFA',
      status: 'Inactive'
    },
    {
      module: 'CT022-3-2',
      dateTime: '19-Sep-2019, 11:00 AM - 1:00AM',
      publicationDate: '19-Sep-2019 - 20-Sep-2019',
      createdBy: 'MUSTAFA',
      status: 'Active'
    },
    {
      module: 'CT001-3-2',
      dateTime: '19-Sep-2019, 11:00 AM - 1:00AM',
      publicationDate: '19-Sep-2019 - 20-Sep-2019',
      createdBy: 'MUSTAFA',
      status: 'Inactive'
    },
    {
      module: 'CT022-3-2',
      dateTime: '19-Sep-2019, 11:00 AM - 1:00AM',
      publicationDate: '19-Sep-2019 - 20-Sep-2019',
      createdBy: 'MUSTAFA',
      status: 'Active'
    },
    {
      module: 'CT001-3-2',
      dateTime: '19-Sep-2019, 11:00 AM - 1:00AM',
      publicationDate: '19-Sep-2019 - 20-Sep-2019',
      createdBy: 'MUSTAFA',
      status: 'Inactive'
    },
    {
      module: 'CT022-3-2',
      dateTime: '19-Sep-2019, 11:00 AM - 1:00AM',
      publicationDate: '19-Sep-2019 - 20-Sep-2019',
      createdBy: 'MUSTAFA',
      status: 'Active'
    },
    {
      module: 'CT001-3-2',
      dateTime: '19-Sep-2019, 11:00 AM - 1:00AM',
      publicationDate: '19-Sep-2019 - 20-Sep-2019',
      createdBy: 'MUSTAFA',
      status: 'Inactive'
    },
    {
      module: 'CT022-3-2',
      dateTime: '19-Sep-2019, 11:00 AM - 1:00AM',
      publicationDate: '19-Sep-2019 - 20-Sep-2019',
      createdBy: 'MUSTAFA',
      status: 'Active'
    },
    {
      module: 'CT001-3-2',
      dateTime: '19-Sep-2019, 11:00 AM - 1:00AM',
      publicationDate: '19-Sep-2019 - 20-Sep-2019',
      createdBy: 'MUSTAFA',
      status: 'Inactive'
    },
    {
      module: 'CT022-3-2',
      dateTime: '19-Sep-2019, 11:00 AM - 1:00AM',
      publicationDate: '19-Sep-2019 - 20-Sep-2019',
      createdBy: 'MUSTAFA',
      status: 'Active'
    },
    {
      module: 'CT001-3-2',
      dateTime: '19-Sep-2019, 11:00 AM - 1:00AM',
      publicationDate: '19-Sep-2019 - 20-Sep-2019',
      createdBy: 'MUSTAFA',
      status: 'Inactive'
    },
    {
      module: 'CT022-3-2',
      dateTime: '19-Sep-2019, 11:00 AM - 1:00AM',
      publicationDate: '19-Sep-2019 - 20-Sep-2019',
      createdBy: 'MUSTAFA',
      status: 'Active'
    },
    {
      module: 'CT001-3-2',
      dateTime: '19-Sep-2019, 11:00 AM - 1:00AM',
      publicationDate: '19-Sep-2019 - 20-Sep-2019',
      createdBy: 'MUSTAFA',
      status: 'Inactive'
    },
    {
      module: 'CT022-3-2',
      dateTime: '19-Sep-2019, 11:00 AM - 1:00AM',
      publicationDate: '19-Sep-2019 - 20-Sep-2019',
      createdBy: 'MUSTAFA',
      status: 'Active'
    },
    {
      module: 'CT001-3-2',
      dateTime: '19-Sep-2019, 11:00 AM - 1:00AM',
      publicationDate: '19-Sep-2019 - 20-Sep-2019',
      createdBy: 'MUSTAFA',
      status: 'Inactive'
    },
    {
      module: 'CT022-3-2',
      dateTime: '19-Sep-2019, 11:00 AM - 1:00AM',
      publicationDate: '19-Sep-2019 - 20-Sep-2019',
      createdBy: 'MUSTAFA',
      status: 'Active'
    },
    {
      module: 'CT001-3-2',
      dateTime: '19-Sep-2019, 11:00 AM - 1:00AM',
      publicationDate: '19-Sep-2019 - 20-Sep-2019',
      createdBy: 'MUSTAFA',
      status: 'Inactive'
    },
    {
      module: 'CT022-3-2',
      dateTime: '19-Sep-2019, 11:00 AM - 1:00AM',
      publicationDate: '19-Sep-2019 - 20-Sep-2019',
      createdBy: 'MUSTAFA',
      status: 'Active'
    },
  ];

  onDelete = false;
  isPast = false;
  selectedExamScheduleOption = 'Exam Schedule';

  constructor(public navCtrl: NavController) { }

  ngOnInit() {
  }

  toggleRemoveExamSchedule() {
    this.onDelete = !this.onDelete;
  }

  toggleExamView() {
    this.isPast = !this.isPast;
  }

  viewExamScheduleDetails() {
    this.navCtrl.navigateForward(['exam-schedule-details']);
  }
}
