import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, ModalController, ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs';

import { ConsultationSlot, SlotDuplicated, StaffDirectory } from 'src/app/interfaces';
import { WsApiService } from 'src/app/services';

@Component({
  selector: 'page-book-slot-modal',
  templateUrl: 'book-slot-modal.html',
  styleUrls: ['book-slot-modal.scss'],
  providers: [DatePipe]
})
export class BookSlotModalPage implements OnInit {
  url = 'https://iuvvf9sxt7.execute-api.ap-southeast-1.amazonaws.com/staging';
  verifyslot$: Observable<SlotDuplicated>;
  dataToSend: { slotData: ConsultationSlot, staffData: StaffDirectory }; // DATA COMING FROM THE PAGE
  loading: HTMLIonLoadingElement;
  studentEmail: string;

  maxLength = 128;

  formModel: {
    slot_id: number,
    consultation_with: string,
    additional_note: string,
    reason: string
  };

  slotSchedule: {
    start_date: string,
    time: string
  };

  consultationWithOptions = [
    'Lecturer',
    'Masters Supervisor',
    'Doctoral Supervisor',
    'Internship Supervisor',
    'FYP Supervisor',
    'Academic Mentor',
    'Programme Leader',
    'Head of School',
    'Dean',
    'Registrar',
    'Manager Student Relations',
  ];

  constructor(
    private modalCtrl: ModalController,
    private storage: Storage,
    private ws: WsApiService,
    public alertCtrl: AlertController,
    private loadingController: LoadingController,
    private toastCtrl: ToastController,
    private datePipe: DatePipe
  ) {
  }
  ngOnInit() {
    // const dataToVerify = this.dataToSend.slotData.datetimeforsorting + '.00000';
    // this.verifyslot$ = this.ws.get<SlotDuplicated>(`/iconsult/verifyduplicateslot/${dataToVerify}`);
    this.storage.get('/student/profile').then(
      studentProfile => {
        this.studentEmail = studentProfile.STUDENT_EMAIL;
      }
    );

    this.formModel = {
      slot_id: this.dataToSend.slotData.slot_id,
      consultation_with: '',
      additional_note: '',
      reason: ''
    };

    this.slotSchedule = {
      start_date: this.datePipe.transform(this.dataToSend.slotData.start_time, 'yyyy-MM-dd', '+0800'),
      time: this.datePipe.transform(this.dataToSend.slotData.start_time, 'HH:mm', '+0800') +
            ' - ' +
            this.datePipe.transform(this.dataToSend.slotData.end_time, 'HH:mm', '+0800')
    };
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }

  bookSlot() {
    // Verification just in case if the button disabled is removed
    if (this.formModel.consultation_with === '' && this.formModel.reason === '') {
      this.showToastMessage('You cannot submit while having a blank field', 'danger');
      return;
    }

    this.alertCtrl.create({
      header: 'Confirm Booking',
      subHeader: 'Are you sure you want to book the following consultation hour?',
      message: `Consultation hour with ${this.dataToSend.staffData.FULLNAME}
       on ${this.slotSchedule.start_date} at ${this.slotSchedule.time}`,
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
            this.ws.post<any>('/iconsult/booking?', {
              body: this.formModel,
            }).subscribe(

              {
                next: _ => {
                  this.showToastMessage('Slot has been booked successfully!', 'success');
                },
                error: (err) => {
                  this.dismissLoading();
                  this.showToastMessage(err.status + ': ' + err.error.error, 'danger');
                },
                complete: () => {
                  this.dismissLoading();
                  this.modalCtrl.dismiss('booked');
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
      animated: true,
      buttons: [
        {
          text: 'Close',
          role: 'cancel'
        }
      ],
      // enterAnimation: toastMessageEnterAnimation,
      // leaveAnimation: toastMessageLeaveAnimation
    }).then(toast => toast.present());
  }
}
