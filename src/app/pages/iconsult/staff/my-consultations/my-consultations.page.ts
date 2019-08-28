import { Component, OnInit } from '@angular/core';
import { ModalController, AlertController, LoadingController, ToastController } from '@ionic/angular';
import { map, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { CalendarComponentOptions, DayConfig } from 'ion2-calendar';
import * as moment from 'moment';

import { WsApiService } from 'src/app/services';
import { LecturerConsultation } from 'src/app/interfaces';
import { ConsultationsSummaryModalPage } from './modals/summary/summary-modal';
import { LecturerSlotDetailsModalPage } from './modals/lecturer-slot-details/lecturer-slot-details-modal';
import { UnavailabilityDetailsModalPage } from './modals/unavailability-details/unavailability-details-modal';
// import { toastMessageEnterAnimation } from 'src/app/animations/toast-message-animation/enter';
// import { toastMessageLeaveAnimation } from 'src/app/animations/toast-message-animation/leave';


@Component({
  selector: 'app-my-consultations',
  templateUrl: './my-consultations.page.html',
  styleUrls: ['./my-consultations.page.scss'],
})
export class MyConsultationsPage implements OnInit {
  slots$: Observable<{}>;
  todaysDate = this.iconsultFormatDate(new Date());
  skeletonItemsNumber = new Array(4);
  loading: HTMLIonLoadingElement;
  summaryDetails: { // Group of summary data used inside the summary modal
    totalOpenedSlots: number,
    totalAvailableSlots: number,
    totalUnavailalbeSlots: number,
    totalBookedSlots: number,
  };

  skeltonArray = new Array(4); // loading

  dateToFilter = this.todaysDate; // ngmodel var

  daysConfigrations: DayConfig[] = []; // ion-calendar plugin
  options: CalendarComponentOptions = {
    from: new Date(),
    to: null, // null to disable all calendar button. Days configurations will enable only dates with slots
    daysConfig: this.daysConfigrations
  };

  constructor(
    private ws: WsApiService,
    private modalCtrl: ModalController,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private toastCtrl: ToastController
  ) { }

  iconsultFormatDate(date: Date) { // Format used in iConsult date
    return moment(date).format('YYYY-MM-DD');
  }

  async showSummary() { // summary modal
    const modal = await this.modalCtrl.create({
      component: ConsultationsSummaryModalPage,
      componentProps: { summaryDetails: this.summaryDetails },
    });
    await modal.present();
    await modal.onDidDismiss();
  }

  async openSlotDetailsModal(
    slotId: string, startTime: string, endTime: string, dateAndTime: string, availibilityId: number, date: string, timee: string) {
    const dataToSend = { slotId, startTime, endTime, dateAndTime, availibilityId, date, timee };
    const modal = await this.modalCtrl.create({
      component: LecturerSlotDetailsModalPage,
      cssClass: 'add-min-height',
      componentProps: { dataToSend, notFound: 'No slot Selected' },
    });
    await modal.present();
    await modal.onDidDismiss().then(
      data => {
        if (data.data === 'booked') {
          this.daysConfigrations = [];
          this.getData();
        }
      }
    );
  }

  async openUnavailableSlotDetails(unavailibilityid: string) {
    const modal = await this.modalCtrl.create({
      component: UnavailabilityDetailsModalPage,
      cssClass: 'add-min-height',
      componentProps: { unavailibilityid, notFound: 'No slot Selected' },
    });
    await modal.present();
    await modal.onDidDismiss();
  }


  ngOnInit() {
    this.getData();
  }

  async cancelAvailableSlot(slot: LecturerConsultation) {
    const alert = await this.alertController.create({
      header: 'Cancelling an opened slot',
      message: `You are about to cancel the slot opened on ${slot.dateandtime.split(' ')[0]} at ${slot.dateandtime.split(' ')[1]}`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => { }
        }, {
          text: 'Submit',
          handler: () => {
            this.presentLoading();
            const cancellationBody = {
              availibility_id: slot.availibilityid,
              date: slot.date,
              timee: slot.timee,
              status: 1, // always 1
              slotid: null // always null
            };
            this.sendCancelSlotRequest(cancellationBody).subscribe(
              {
                next: res => {
                  this.daysConfigrations = [];
                  this.showToastMessage('Slot has been cancelled successfully!', 'success');
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
      ]
    });
    await alert.present();
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

  sendCancelSlotRequest(cancelledSlotDetails: any) {
    return this.ws.post<any>('/iconsult/lecCancelfreeslot', {
      body: cancelledSlotDetails,
    });
  }

  getData() { // to be changed with refresher
    this.summaryDetails = { // Used here to calculate the number again after refresh
      totalOpenedSlots: 0,
      totalAvailableSlots: 0,
      totalUnavailalbeSlots: 0,
      totalBookedSlots: 0,
    };
    this.options = {
      from: new Date(),
      to: null, // null to disable all calendar button. Days configurations will enable only dates with slots
      daysConfig: this.daysConfigrations
    };
    this.slots$ = this.ws.get<LecturerConsultation[]>('/iconsult/upcomingconlec', true).pipe(
      map(slots => slots.filter(slot => slot.status !== 'Clossed')), // filter closed slots
      map(
        slots => slots.reduce((r, a) => { // Grouping the slots daily and get the summary data
          if (a.status === 'Unavailable') {
            this.summaryDetails.totalUnavailalbeSlots++;
          }
          if (a.status === 'Booked') {
            this.summaryDetails.totalBookedSlots++;
          }
          if (a.status !== 'Unavailable') {
            this.summaryDetails.totalOpenedSlots++;
          }
          if (a.status === 'Available') {
            this.summaryDetails.totalAvailableSlots++;
          }
          const consultationsDate = a.dateandtime.split(' ')[0];
          r[consultationsDate] = r[consultationsDate] || {};
          r[consultationsDate].items = r[consultationsDate].items || [];
          r[consultationsDate].items.push(a);
          return r;
        }, {})
      ),
      tap(dates => { // add css classes for slot type
        Object.keys(dates).forEach(
          date => {
            const items = dates[date].items;
            const numberOfAvailableAndBookedSlots = items.filter(item => item.status === 'Available' || item.status === 'Booked').length;
            const numberOfBookedSlots = items.filter(item => item.status === 'Booked').length;
            const cssClass = numberOfAvailableAndBookedSlots === numberOfBookedSlots && numberOfBookedSlots > 0
              ? `booked`
              : numberOfBookedSlots > 0
                ? `partially-booked`
                : numberOfBookedSlots === 0 && numberOfAvailableAndBookedSlots !== 0
                  ? `available`
                  : 'unavailable';

            this.daysConfigrations.push({
              date: moment(date, 'YYYY-MM-DD').toDate(),
              subTitle: '.',
              cssClass: cssClass + ' colored',
              disable: false
            });
          }
        );
        return dates;
      })
    );
  }
}
