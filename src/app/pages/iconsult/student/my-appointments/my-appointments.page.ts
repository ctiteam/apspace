import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController, ModalController, ToastController } from '@ionic/angular';
import { Observable, forkJoin } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ConsultationHour, SlotDetails, StaffDirectory } from 'src/app/interfaces';
import { AppLauncherService, WsApiService } from 'src/app/services';

// import { toastMessageEnterAnimation } from 'src/app/animations/toast-message-animation/enter';
// import { toastMessageLeaveAnimation } from 'src/app/animations/toast-message-animation/leave';
import { SlotDetailsModalPage } from './slot-details-modal';

import * as moment from 'moment';

@Component({
  selector: 'app-my-appointments',
  templateUrl: './my-appointments.page.html',
  styleUrls: ['./my-appointments.page.scss'],
})
export class MyAppointmentsPage {
  url = 'https://iuvvf9sxt7.execute-api.ap-southeast-1.amazonaws.com/staging';
  bookings$: Observable<any[]>;
  slotDetails$: Observable<SlotDetails>;
  loading: HTMLIonLoadingElement;
  staff: StaffDirectory;

  skeltonArray = new Array(4);

  constructor(
    private alertController: AlertController,
    private appLauncherService: AppLauncherService,
    private loadingController: LoadingController,
    private modalCtrl: ModalController,
    private router: Router,
    private toastCtrl: ToastController,
    private ws: WsApiService
  ) {
  }

  ionViewDidEnter() {
    this.doRefresh();
  }

  doRefresh(refresher?) {
    const bookings$: Observable<ConsultationHour[]> = this.ws.get<ConsultationHour[]>('/iconsult/bookings?', {
      url: this.url
    }).pipe(
      map(bookingList => { // Check if slot is passed and modify its status to passed
        return bookingList.map(bookings => {
          if (bookings.status === 'normal' && moment(bookings.booking_datetime, 'YYYY-MM-DD kk:mm:ss').toDate() < new Date()) {
            bookings.status = 'Passed';
          }
          return bookings;
        });
      }),
      finalize(() => refresher && refresher.target.complete())
    );

    // get staff details to combine with bookings
    this.bookings$ = forkJoin([
      bookings$,
      this.ws.get<StaffDirectory[]>('/staff/listing')
    ]).pipe(
      map(
        ([bookings, staffList]) => {
          const staffUsernames = new Set(bookings.map(booking => booking.slot_lecturer_sam_account_name.toLowerCase()));
          const staffKeyMap = staffList
            .filter(staff => staffUsernames.has(staff.ID.toLowerCase()))
            .reduce(
              (previous, current) => {
                previous[current.ID] = current;

                return previous;
              },
              {}
            );
          const listOfBookingWithStaffDetail = bookings.map(
            booking => ({
              ...booking,
              ...{
                staff_detail: staffKeyMap[booking.slot_lecturer_sam_account_name]
              }
            })
          );

          return listOfBookingWithStaffDetail;
        }
      )
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

  async openSlotDetailsModal(booking) {
    const modal = await this.modalCtrl.create({
      component: SlotDetailsModalPage,
      cssClass: 'add-min-height',
      componentProps: { booking, notFound: 'No booking slot Selected' },
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

  async cancelBooking(booking) {
    const startDate = moment(booking.slot_start_time).format('YYYY-MM-DD');
    const alert = await this.alertController.create({
      header: `Cancelling Appointment with ${booking.staff_detail.FULLNAME} on ${startDate}`,
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
          text: 'Dismiss',
          role: 'cancel',
          handler: () => { }
        }, {
          text: 'Cancel Booking Slot',
          handler: (data) => {
            if (!data.cancellationReason) {
              this.showToastMessage('Cancellation Reason is Required !!', 'danger');
            } else {
              this.presentLoading();
              const cancellationBody = [{
                booking_id: booking.id,
                remark: data.cancellationReason
              }];
              this.sendCancelBookingRequest(cancellationBody).subscribe(
                {
                  next: () => {
                    this.showToastMessage('Booking has been cancelled successfully!', 'success');
                  },
                  error: () => {
                    this.showToastMessage('Something went wrong! please try again or contact us via the feedback page', 'danger');
                  },
                  complete: () => {
                    this.dismissLoading();
                    this.doRefresh();
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

  sendCancelBookingRequest(cancelledBookingSlotDetails: any) {
    return this.ws.put<any>('/iconsult/booking/cancel?', {
      url: this.url,
      body: cancelledBookingSlotDetails,
    });
  }
}
