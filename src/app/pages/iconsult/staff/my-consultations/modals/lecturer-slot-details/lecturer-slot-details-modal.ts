import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, ModalController, ToastController } from '@ionic/angular';
import { utcToZonedTime } from 'date-fns-tz';
import { Observable } from 'rxjs';

import { ConsultationHour, ConsultationSlot } from 'src/app/interfaces';
import { WsApiService } from 'src/app/services';
@Component({
  selector: 'page-lecturer-slot-details-modal',
  templateUrl: 'lecturer-slot-details-modal.html',
  styleUrls: ['lecturer-slot-details-modal.scss']
})
// This page has not been migrated yet. It is added to fix the pipeline error
export class LecturerSlotDetailsModalPage implements OnInit {
  url = 'https://iuvvf9sxt7.execute-api.ap-southeast-1.amazonaws.com/staging';
  slot: ConsultationSlot;
  dateNow = new Date();
  showRemarks = false;
  remarksText = '';
  copyToGIMS = false;
  bookingDetails$: Observable<ConsultationHour>;
  loading: HTMLIonLoadingElement;

  constructor(
    private modalCtrl: ModalController,
    private ws: WsApiService,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private loadingController: LoadingController
  ) { }

  ngOnInit() {
    if (utcToZonedTime(new Date(this.slot.start_time), 'Asia/Kuala_Lumpur')
      <= utcToZonedTime(this.dateNow, 'Asia/Kuala_Lumpur')) {
      this.showRemarks = true;
    }
  }

  addRemarks() {
    const body = {
      booking_id: this.slot.booking_detail.id,
      remark: this.remarksText,
      synced_to_gims: this.copyToGIMS ? 1 : 0
    };

    if (body.remark === '') {
      this.showToastMessage('You cannot submit while having a blank field', 'danger');
      return;
    }

    this.alertCtrl.create({
      header: 'Adding Remarks!',
      message: `Are you sure you want to add remarks to this booking?`,
      buttons: [
        {
          text: 'No',
          handler: () => { }
        },
        {
          text: 'Yes',
          handler: () => {
            this.presentLoading();

            this.ws.put<any>('/iconsult/remark?', {
              body
            }).subscribe(
              {
                next: _ => {
                  this.showToastMessage('Remarks Added Successfully!', 'success');
                },
                error: _ => this.showToastMessage('Something went wrong! please try again or contact us via the feedback page', 'danger'),
                complete: () => {
                  this.dismissLoading();
                  this.modalCtrl.dismiss('SUCCESS');
                }
              }
            );
          }
        }
      ]
    }).then(confirm => confirm.present());
  }

  showToastMessage(message: string, color: 'danger' | 'success') {
    this.toastCtrl.create({
      message,
      duration: 5000,
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

  dismiss() {
    this.modalCtrl.dismiss();
  }
}
