import { Component, OnInit } from '@angular/core';
import { ModalController, AlertController, ToastController, LoadingController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { WsApiService } from 'src/app/services';
import { LecturerSlotDetails, LecturerRemarks } from 'src/app/interfaces';

import * as moment from 'moment';
@Component({
  selector: 'page-lecturer-slot-details-modal',
  templateUrl: 'lecturer-slot-details-modal.html',
  styleUrls: ['lecturer-slot-details-modal.scss']
})
// This page has not been migrated yet. It is added to fix the pipeline error
export class LecturerSlotDetailsModalPage implements OnInit {
  dataToSend;
  dateNow = new Date();
  showRemarks = false;
  remarksText = '';
  copyToGIMS = false;
  slotDetails$: Observable<LecturerSlotDetails>;
  lecturerRemarks$: Observable<LecturerRemarks[]>;
  loading: HTMLIonLoadingElement;

  constructor(
    private modalCtrl: ModalController,
    private ws: WsApiService,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private loadingController: LoadingController
  ) { }

  ngOnInit() {
    if (moment(this.dataToSend.dateAndTime, '').toDate() <= this.dateNow) {
      this.showRemarks = true;
    }
    this.slotDetails$ = this.ws.get<LecturerSlotDetails[]>(`/iconsult/detailpage/${this.dataToSend.slotId}`, true).pipe(
      map(response => response[0]),
    );
    this.lecturerRemarks$ = this.ws.get<LecturerRemarks[]>(`/iconsult/lecgetfeedback/${this.dataToSend.slotId}`, true);
  }

  addRemarks() {
    const body = {
      slotid: this.dataToSend.slotId,
      entry_datetime: moment().format(),
      feedback: this.remarksText,
      gims_status: this.copyToGIMS ? 1 : 0
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
            console.log(body);
            this.presentLoading();
            this.ws.post<any>('/iconsult/lecaddfeedback', { body }).subscribe(
              {
                next: _ => {
                  this.showToastMessage('Remarks Added Successfully!', 'success');
                },
                error: _ => this.showToastMessage('Something went wrong! please try again or contact us via the feedback page', 'danger'),
                complete: () => {
                  this.dismissLoading();
                  this.modalCtrl.dismiss();
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
