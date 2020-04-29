import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController, NavController, ToastController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { ExamScheduleAdmin } from 'src/app/interfaces/exam-schedule-admin';
import { WsApiService } from 'src/app/services';
import { AddExamSchedulePage } from './add-exam-schedule/add-exam-schedule.page';

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

  examSchedules$: Observable<ExamScheduleAdmin[]>;
  pastExamSchedules$: Observable<ExamScheduleAdmin[]>;

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

  examScheduleToBeDeleted: ExamScheduleAdmin[] = [];

  devUrl = 'https://jeioi258m1.execute-api.ap-southeast-1.amazonaws.com/dev';

  constructor(
    public toastCtrl: ToastController,
    public navCtrl: NavController,
    public modalCtrl: ModalController,
    public alertCtrl: AlertController,
    private ws: WsApiService
  ) { }

  ngOnInit() {
    this.examSchedules$ = this.ws.get<ExamScheduleAdmin[]>('/exam/current_exam', {url: this.devUrl}).pipe(
      shareReplay()
    );

    this.pastExamSchedules$ = this.ws.get<ExamScheduleAdmin[]>('/exam/past_exam', {url: this.devUrl}).pipe(
      map(pastExamSchedules => [pastExamSchedules[0]]),
      shareReplay()
    );
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
