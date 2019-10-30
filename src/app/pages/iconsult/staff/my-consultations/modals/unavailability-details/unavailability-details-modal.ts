import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, ModalController, ToastController } from '@ionic/angular';
import { Observable } from 'rxjs';

import { UnavailabilityDetails } from 'src/app/interfaces';
import { WsApiService } from 'src/app/services';

@Component({
  selector: 'page-unavailability-details-modal',
  templateUrl: 'unavailability-details-modal.html',
  styleUrls: ['unavailability-details-modal.scss']
})

export class UnavailabilityDetailsModalPage implements OnInit {
  unavailibilityid;
  slotDetails$: Observable<UnavailabilityDetails[]>;
  loading: HTMLIonLoadingElement;

  constructor(
    private modalCtrl: ModalController,
    private ws: WsApiService,
    private toastCtrl: ToastController,
    private loadingController: LoadingController,
    private alertCtrl: AlertController
  ) { }

  ngOnInit() {
    this.slotDetails$ = this.ws.get<UnavailabilityDetails[]>(`/iconsult/get_unavailrule_details/${this.unavailibilityid}`);
  }


  async disableUnavialbility() {
    const alert = await this.alertCtrl.create({
      header: 'Disabling Unavailability Slot(s)',
      message: 'Are you sure you want to disable the seleted unavailability slot?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => { }
        }, {
          text: 'Submit',
          handler: () => {
            this.presentLoading();
            const body = {
              rule_status: 0, // always 0 set by the backend
            };
            this.ws.put<any>(`/iconsult/UnavailabilityRules_update/${this.unavailibilityid}`, { body }).subscribe(
              {
                next: _ => {
                  this.showToastMessage('Unavailability slot has been disabled successfully!', 'success');
                },
                error: _ => {
                  this.dismissLoading();
                  this.showToastMessage('Something went wrong! please try again or contact us via the feedback page', 'danger');
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
    });
    await alert.present();
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
