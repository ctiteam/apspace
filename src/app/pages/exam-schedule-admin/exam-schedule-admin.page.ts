import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController, NavController, ToastController } from '@ionic/angular';
import { AddExamSchedulePage } from './add-exam-schedule/add-exam-schedule.page';

// interface ExamSchedule {
//   module: string;
//   date: string;
//   time: string;
//   publicationDate: string;
//   createdBy: string;
//   status: string;
//   lastEdited: string;
// }

interface Resit {
  module: string;
  date: string;
  time: string;
  venue: string;
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

  examSchedules: any = [
    {
      module: 'CT001-3-1',
      date: '19-Sep-2019',
      time: '11:00 AM - 1:00AM',
      publicationDate: '19-Sep-2019 - 20-Sep-2019',
      createdBy: 'MUSTAFA',
      status: 'Inactive',
      lastEdited: '*Username'
    },
    {
      module: 'CT001-3-2',
      date: '19-Sep-2019',
      time: '11:00 AM - 1:00AM',
      publicationDate: '19-Sep-2019 - 20-Sep-2019',
      createdBy: 'MUSTAFA',
      status: 'Active',
      lastEdited: '*Username'
    },
    {
      module: 'CT001-3-3',
      date: '19-Sep-2019',
      time: '11:00 AM - 1:00AM',
      publicationDate: '19-Sep-2019 - 20-Sep-2019',
      createdBy: 'MUSTAFA',
      status: 'Inactive',
      lastEdited: '*Username'
    },
    {
      module: 'CT001-3-4',
      date: '19-Sep-2019',
      time: '11:00 AM - 1:00AM',
      publicationDate: '19-Sep-2019 - 20-Sep-2019',
      createdBy: 'MUSTAFA',
      status: 'Inactive',
      lastEdited: '*Username'
    }
  ];

  pastExamSchedules: any = [
    {
      module: 'CT001-1-1',
      date: '19-Sep-2019',
      time: '11:00 AM - 1:00AM',
      publicationDate: '19-Sep-2019 - 20-Sep-2019',
      createdBy: 'MUSTAFA',
      status: 'Inactive',
      lastEdited: '*Username'
    },
    {
      module: 'CT001-3-5',
      date: '19-Sep-2019',
      time: '11:00 AM - 1:00AM',
      publicationDate: '19-Sep-2019 - 20-Sep-2019',
      createdBy: 'MUSTAFA',
      status: 'Active',
      lastEdited: '*Username'
    },
    {
      module: 'CT001-1-1',
      date: '19-Sep-2019',
      time: '11:00 AM - 1:00AM',
      publicationDate: '19-Sep-2019 - 20-Sep-2019',
      createdBy: 'MUSTAFA',
      status: 'Inactive',
      lastEdited: '*Username'
    },
    {
      module: 'CT001-3-6',
      date: '19-Sep-2019',
      time: '11:00 AM - 1:00AM',
      publicationDate: '19-Sep-2019 - 20-Sep-2019',
      createdBy: 'MUSTAFA',
      status: 'Inactive',
      lastEdited: '*Username'
    }
  ];

  resits: Resit[] = [
    {
      module: 'CT001-3-2',
      date: '19-Sep-2019',
      time: '11:00 AM - 1:00AM',
      venue: '1, APIIT@TPM',
      status: 'Inactive'
    },
    {
      module: 'CT001-3-2',
      date: '19-Sep-2019',
      time: '11:00 AM - 1:00AM',
      venue: '1, APIIT@TPM',
      status: 'Inactive'
    },
    {
      module: 'CT001-3-2',
      date: '19-Sep-2019',
      time: '11:00 AM - 1:00AM',
      venue: '1, APIIT@TPM',
      status: 'Inactive'
    },
    {
      module: 'CT001-3-2',
      date: '19-Sep-2019',
      time: '11:00 AM - 1:00AM',
      venue: '1, APIIT@TPM',
      status: 'Inactive'
    },
    {
      module: 'CT001-3-2',
      date: '19-Sep-2019',
      time: '11:00 AM - 1:00AM',
      venue: '1, APIIT@TPM',
      status: 'Inactive'
    }
  ];

  onDelete = false;
  isPast = false;
  selectedExamScheduleOption = 'Exam Schedule';

  examScheduleToBeDeleted = [];

  constructor(
    public toastCtrl: ToastController,
    public navCtrl: NavController,
    public modalCtrl: ModalController,
    public alertCtrl: AlertController
  ) { }

  ngOnInit() {
  }

  addSelectedExamSchedule(selectedExamSchedule) {
    if (!(this.examScheduleToBeDeleted.find(examSchedule => examSchedule.module === selectedExamSchedule.module))) {
      this.examScheduleToBeDeleted.push(selectedExamSchedule);
    } else {
      this.examScheduleToBeDeleted.forEach((examSchedule, index, examScheduleToBeDeleted) => {
        if (examSchedule.module === selectedExamSchedule.module) {
          examScheduleToBeDeleted.splice(index, 1);
        }
      });
    }
  }

  deleteSelectedExamSchedule() {
    if (this.examScheduleToBeDeleted) {
      this.alertCtrl.create({
        header: 'Warning',
        subHeader: 'You have exam schedules that you\'re about to cancel. Do you want to continue?',
        buttons: [
          {
            text: 'No',
            role: 'cancel',
            handler: () => {}
          },
          {
            text: 'Yes',
            handler: () => {
              this.toastCtrl.create({
                message: 'Successfully deleted the exam schedule.',
                color: 'success',
                duration: 3000,
                position: 'top'
              }).then(toast => {
                this.examScheduleToBeDeleted = [];
                this.toggleRemoveExamSchedule();
                toast.present();
              });
            }
          }
        ]
      }).then(alert => alert.present());
    }
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

  addNewExamSchedule() {
    this.modalCtrl.create({
      component: AddExamSchedulePage,
      cssClass: 'full-page-modal'
    }).then(modal => modal.present());
  }

  segmentChanged(event) {
    this.selectedExamScheduleOption = event.detail.value;
  }
}
