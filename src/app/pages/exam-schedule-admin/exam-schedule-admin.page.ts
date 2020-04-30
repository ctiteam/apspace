import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController, ModalController, ToastController } from '@ionic/angular';
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
  loading: HTMLIonLoadingElement;

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
    public router: Router,
    public modalCtrl: ModalController,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    private ws: WsApiService
  ) { }

  ngOnInit() {
    this.doRefresh();
  }

  doRefresh() {
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
      const body = new FormData();

      this.examScheduleToBeDeleted.forEach(examSchedule => body.append('exam_id[]', examSchedule.EXAMID.toString()));

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
              this.presentLoading();
              this.ws.post<any>('/exam/delete_exam_schedule', {
                url: this.devUrl,
                body,
                headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' })
              })
              .subscribe({
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
    console.log('before send ', examId);
    this.router.navigate(['exam-schedule-details', examId], {replaceUrl: false});
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

  segmentChanged(event) {
    this.selectedExamScheduleOption = event.detail.value;
  }
}
