import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, ModalController, ToastController } from '@ionic/angular';
import { Observable } from 'rxjs';

import { ConsultationHour, ConsultationSlot } from 'src/app/interfaces';
import { WsApiService } from 'src/app/services';

import * as moment from 'moment';
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

  ngOnInit() { // MIGHT NEED TO INSTALL TIMEZONE IN MOMENT JS
    if (moment(this.slot.start_time).toDate() <= this.dateNow) {
      this.showRemarks = true;
    }

  }

  addRemarks() {
    const body = {
      booking_id: this.slot.booking_detail.id,
      remark: this.remarksText,
      synced_to_gims: this.copyToGIMS ? 1 : 0
    };
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
              url: this.url,
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

  // async cancelBooking(slot: LecturerSlotDetails) {
  //   const date = moment(this.dataToSend.start_time).format('YYYY-MM-DD');
  //   const alert = await this.alertCtrl.create({
  //     header: `Canelling Appointment with ${slot.studentname} on ${date}`,
  //     message: 'Please provide us with the cancellation reason:',
  //     inputs: [
  //       {
  //         name: 'cancellationReason',
  //         type: 'text',
  //         placeholder: 'Enter The Cancellation Reason',
  //       },
  //     ],
  //     buttons: [
  //       {
  //         text: 'Cancel',
  //         role: 'cancel',
  //         handler: () => { }
  //       }, {
  //         text: 'Submit',
  //         handler: (data) => {
  //           if (!data.cancellationReason) {
  //             this.showToastMessage('Cancellation Reason is Required !!', 'danger');
  //           } else {
  //             this.presentLoading();
  //             const cancellationDate = moment().format(); // To get the date format required by backend
  //             const cancellationBody = {

  //               // availibility_id: this.dataToSend.,
  //               // cancel_datetime: cancellationDate,
  //               // cancel_reason: data.cancellationReason, // Input field
  //               // cancelled_datetime: cancellationDate,
  //               // date: this.dataToSend.date,
  //               // slotid: slot.slotid,
  //               // status: 1, // always 1 from backend
  //               // timee: this.dataToSend.timee
  //             };
  //             this.sendCancelBookingRequest(cancellationBody).subscribe(
  //               {
  //                 next: () => {
  //                   this.showToastMessage('Booking has been cancelled successfully!', 'success');
  //                 },
  //                 error: () => {
  //                   this.showToastMessage('Something went wrong! please try again or contact us via the feedback page', 'danger');
  //                 },
  //                 complete: () => {
  //                   this.dismissLoading();
  //                   this.modalCtrl.dismiss('booked');
  //                 }
  //               }
  //             );
  //           }
  //         }
  //       }
  //     ]
  //   });
  //   await alert.present();
  // }

  // sendCancelBookingRequest(cancelBookingDetials: any) {
  //   return this.ws.post<any>('/iconsult/booking/cancel?', {
  //     url: 'https://iuvvf9sxt7.execute-api.ap-southeast-1.amazonaws.com/staging',
  //     body: cancelBookingDetials,
  //   });
  // }

  showToastMessage(message: string, color: 'danger' | 'success') {
    this.toastCtrl.create({
      message,
      duration: 5000,
      position: 'top',
      color,
      showCloseButton: true,
      animated: true,
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
