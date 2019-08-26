import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, AlertController, ToastController, LoadingController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { WsApiService, AppLauncherService } from 'src/app/services';
import { ConsultationHour, SlotDetails } from 'src/app/interfaces';

// import { toastMessageEnterAnimation } from 'src/app/animations/toast-message-animation/enter';
// import { toastMessageLeaveAnimation } from 'src/app/animations/toast-message-animation/leave';
import { SlotDetailsModalPage } from './slot-details-modal';

import * as moment from 'moment';

@Component({
  selector: 'app-my-appointments',
  templateUrl: './my-appointments.page.html',
  styleUrls: ['./my-appointments.page.scss'],
})
export class MyAppointmentsPage implements OnInit {
  slots$: Observable<ConsultationHour[]>;
  slotDetails$: Observable<SlotDetails>;
  loading: HTMLIonLoadingElement;

  skeltonArray = new Array(4);

  constructor(
    private alertController: AlertController,
    private appLauncherService: AppLauncherService,
    private loadingController: LoadingController,
    private modalCtrl: ModalController,
    private router: Router,
    private toastCtrl: ToastController,
    private ws: WsApiService
  ) { }

  ngOnInit() {
    this.getData();
  }

  getData() { // To be changed with the refresher later
    this.slots$ = this.getSlots();
  }
  getSlots() {
    return this.ws.get<ConsultationHour[]>('/iconsult/upcomingconstu', true).pipe(
      map(slots => { // Check if slot is passed and modify its status to passed
        return slots.map(slot => {
          if (slot.status === 'normal' && moment(slot.datetimeforsorting, 'YYYY-MM-DD kk:mm:ss').toDate() < new Date()) {
            slot.status = 'Passed';
          }
          return slot;
        });
      })
    );
  }

  getSlotDetails(slotId: string) {
    this.slotDetails$ = this.ws.get<SlotDetails>(`/iconsult/detailpageconstu/${slotId}`, true).pipe(
      map(response => response[0]),
    );
  }

  chatInTeams(lecturerCasId: string) {
    const androidSchemeUrl = 'com.microsoft.teams';
    const iosSchemeUrl = 'microsoft-teams://';
    const webUrl = `https://teams.microsoft.com/_#/apps/a2da8768-95d5-419e-9441-3b539865b118/search?q=?${lecturerCasId}`;
    const appStoreUrl = 'https://itunes.apple.com/us/app/microsoft-teams/id1113153706?mt=8';
    const appViewUrl = 'https://teams.microsoft.com/l/chat/0/0?users=';
    // tslint:disable-next-line: max-line-length
    const playStoreUrl = `https://play.google.com/store/apps/details?id=com.microsoft.teams&hl=en&referrer=utm_source%3Dgoogle%26utm_medium%3Dorganic%26utm_term%3D'com.microsoft.teams'&pcampaignid=APPU_1_NtLTXJaHKYr9vASjs6WwAg`;
    this.appLauncherService.launchExternalApp(
      iosSchemeUrl,
      androidSchemeUrl,
      appViewUrl,
      webUrl,
      playStoreUrl,
      appStoreUrl,
      `${lecturerCasId}@staffemail.apu.edu.my`);
  }

  openStaffDirectory() {
    this.router.navigateByUrl('staffs', { replaceUrl: false });
  }

  async openSlotDetailsModal(slotId: string) {
    const modal = await this.modalCtrl.create({
      component: SlotDetailsModalPage,
      cssClass: 'add-min-height',
      componentProps: { slotId, notFound: 'No slot Selected' },
    });
    await modal.present();
    await modal.onDidDismiss();
  }

  showToastMessage(message: string, color: 'danger' | 'success') {
    this.toastCtrl.create({
      message,
      duration: 6000,
      position: 'top',
      color,
      showCloseButton: true,
      animated: true,
      // enterAnimation: toastMessageEnterAnimation,
      // leaveAnimation: toastMessageLeaveAnimation
    }).then(toast => toast.present());
  }

  async cancelBooking(slot: ConsultationHour) {
    const alert = await this.alertController.create({
      header: `Canelling Appointment with ${slot.lecname} on ${slot.date}`,
      message: 'Please provide us with the cancellation reason:',
      inputs: [
        {
          name: 'cancellationReason',
          type: 'text',
          placeholder: 'Enter The Cancellation Reason',
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => { }
        }, {
          text: 'Submit',
          handler: (data) => {
            if (!data.cancellationReason) {
              this.showToastMessage('Cancellation Reason is Required !!', 'danger');
            } else {
              this.presentLoading();
              const cancellationDate = moment().format(); // To get the date format required by backend
              const cancellationBody = {
                availibility_id: slot.availibilityid,
                cancel_datetime: cancellationDate,
                cancel_reason: data.cancellationReason, // Input field
                cancelled_datetime: cancellationDate,
                date: slot.date,
                slotid: slot.slotid,
                status: 0, // always 0 from backend
                timee: slot.datetimeforsorting.split(' ')[1]
              };
              this.sendCancelBookingRequest(cancellationBody).subscribe(
                {
                  next: res => {
                    this.showToastMessage('Booking has been cancelled successfully!', 'success');
                  },
                  error: err => {
                    this.showToastMessage('Something went wrong! please try again or contact us via the feedback page', 'danger');
                  },
                  complete: () => {
                    this.dismissLoading();
                    this.getData();
                  }
                }
              );
            }
          }
        }
      ]
    });
    await alert.present();
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

  sendCancelBookingRequest(cancelledSlotDetails: any) {
    return this.ws.post<any>('/iconsult/lecCancelbookedslot', {
      body: cancelledSlotDetails,
    });
  }

}
