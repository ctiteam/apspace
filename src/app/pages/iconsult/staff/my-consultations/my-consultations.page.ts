import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import {
  AlertController,
  LoadingController,
  ModalController,
  ToastController
} from '@ionic/angular';
import { Observable } from 'rxjs';
import { finalize, map, tap } from 'rxjs/operators';

import { CalendarComponentOptions, DayConfig } from 'ion2-calendar';

import { Router } from '@angular/router';
import { LecturerConsultation } from 'src/app/interfaces';
import { WsApiService } from 'src/app/services';
import { ActivatedRoute } from 'src/testing';
import { LecturerSlotDetailsModalPage } from './modals/lecturer-slot-details/lecturer-slot-details-modal';
import { ConsultationsSummaryModalPage } from './modals/summary/summary-modal';
// import { UnavailabilityDetailsModalPage } from './modals/unavailability-details/unavailability-details-modal';
// import { toastMessageEnterAnimation } from 'src/app/animations/toast-message-animation/enter';
// import { toastMessageLeaveAnimation } from 'src/app/animations/toast-message-animation/leave';

@Component({
  selector: 'app-my-consultations',
  templateUrl: './my-consultations.page.html',
  styleUrls: ['./my-consultations.page.scss'],
  providers: [DatePipe]
})
export class MyConsultationsPage {
  slots$: Observable<{}>;
  todaysDate = new Date();
  skeletonItemsNumber = new Array(4);
  loading: HTMLIonLoadingElement;
  summaryDetails: {
    // Group of summary data used inside the summary modal
    totalAvailableSlots: number;
    totalBookedSlots: number;
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
    private toastCtrl: ToastController,
    private route: ActivatedRoute,
    private router: Router,
    private datePipe: DatePipe
  ) {}

  async showSummary() {
    // summary modal
    const modal = await this.modalCtrl.create({
      component: ConsultationsSummaryModalPage,
      componentProps: { summaryDetails: this.summaryDetails }
    });
    await modal.present();
    await modal.onDidDismiss();
  }

  async openSlotDetailsModal(slot: LecturerConsultation) {
    const modal = await this.modalCtrl.create({
      component: LecturerSlotDetailsModalPage,
      cssClass: 'add-min-height',
      componentProps: { slot, notFound: 'No slot Selected' }
    });
    await modal.present();
    await modal.onDidDismiss().then(data => {
      if (data.data === 'booked') {
        this.daysConfigrations = [];
        this.doRefresh();
      }
    });
  }

  // async openUnavailableSlotDetails(unavailibilityid: string) {
  //   const modal = await this.modalCtrl.create({
  //     component: UnavailabilityDetailsModalPage,
  //     cssClass: "add-min-height",
  //     componentProps: { unavailibilityid, notFound: "No slot Selected" }
  //   });
  //   await modal.present();
  //   await modal.onDidDismiss().then(data => {
  //     if (data.data === "booked") {
  //       this.daysConfigrations = [];
  //       this.doRefresh();
  //     }
  //   });
  // }

  ionViewDidEnter() {
    this.route.queryParams.subscribe(() => {
      // tslint:disable-next-line: max-line-length
      if (
        this.router.getCurrentNavigation() &&
        this.router.getCurrentNavigation().extras.state &&
        this.router.getCurrentNavigation().extras.state.reload
      ) {
        this.daysConfigrations = [];
        this.doRefresh();
      }
    });
    this.doRefresh();
  }

  async cancelAvailableSlot(slot: LecturerConsultation) {
    const startDate = this.datePipe.transform(slot.start_time, 'yyyy-MM-dd');
    const startTime = this.datePipe.transform(slot.start_time, 'hh:mm');
    const alert = await this.alertController.create({
      header: 'Cancelling an opened slot',
      message: `You are about to cancel the slot opened on ${startDate} at ${startTime}`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {}
        },
        {
          text: 'Submit',
          handler: () => {
            this.presentLoading();
            const cancellationBody = [
              {
                slot_id: slot.slot_id
              }
            ];

            this.sendCancelSlotRequest(cancellationBody).subscribe({
              next: () => {
                this.daysConfigrations = [];
                this.showToastMessage(
                  'Slot has been cancelled successfully!',
                  'success'
                );
              },
              error: () => {
                this.showToastMessage(
                  'Something went wrong! please try again or contact us via the feedback page',
                  'danger'
                );
              },
              complete: () => {
                this.dismissLoading();
                this.doRefresh();
              }
            });
          }
        }
      ]
    });
    await alert.present();
  }

  showToastMessage(message: string, color: 'danger' | 'success') {
    this.toastCtrl
      .create({
        message,
        duration: 6000,
        position: 'top',
        color,
        showCloseButton: true,
        animated: true
        // enterAnimation: toastMessageEnterAnimation,
        // leaveAnimation: toastMessageLeaveAnimation
      })
      .then(toast => toast.present());
  }

  async presentLoading() {
    this.loading = await this.loadingController.create({
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

  sendCancelSlotRequest(cancelledSlotDetails: any) {
    return this.ws.put<any>('/iconsult/slot/cancel?', {
      url: 'https://x8w3m20p69.execute-api.ap-southeast-1.amazonaws.com/dev',
      body: cancelledSlotDetails
    });
  }

  doRefresh(refresher?) {
    // to be changed with refresher
    this.summaryDetails = {
      // Used here to calculate the number again after refresh
      totalAvailableSlots: 0,
      totalBookedSlots: 0
    };
    this.options = {
      from: new Date(),
      to: null, // null to disable all calendar button. Days configurations will enable only dates with slots
      daysConfig: this.daysConfigrations
    };

    this.slots$ = this.ws
      .get<LecturerConsultation[]>(
        '/iconsult/slots?lecturer_sam_account_name=we.yuan',
        {
          url: 'https://x8w3m20p69.execute-api.ap-southeast-1.amazonaws.com/dev'
        }
      )
      .pipe(
        map(slots =>
          slots.reduce((r, a) => {
            // Grouping the slots daily and get the summary data

            if (
              a.status !== 'Cancelled' &&
              a.status !== 'Cancelled by lecturer'
            ) {
              if (a.status === 'Booked') {
                this.summaryDetails.totalBookedSlots++;
              }
              if (
                a.status === 'Available' ||
                a.status === 'Cancelled by student'
              ) {
                this.summaryDetails.totalAvailableSlots++;
              }

              const consultationsDate = this.datePipe.transform(
                a.start_time,
                'yyyy-MM-dd'
              );
              r[consultationsDate] = r[consultationsDate] || {};
              r[consultationsDate].items = r[consultationsDate].items || [];
              r[consultationsDate].items.push(a);
            }
            console.log(r);
            return r;
          }, {})
        ),
        tap(dates => {
          // add css classes for slot type
          Object.keys(dates).forEach(date => {
            const items = dates[date].items;
            const numberOfAvailableAndBookedSlots = items.filter(
              item => item.status === 'Available' || item.status === 'Booked'
            ).length;
            const numberOfBookedSlots = items.filter(
              item => item.status === 'Booked'
            ).length;
            const cssClass =
              numberOfAvailableAndBookedSlots === numberOfBookedSlots &&
              numberOfBookedSlots > 0
                ? `booked`
                : numberOfBookedSlots > 0
                ? `partially-booked`
                : numberOfBookedSlots === 0 &&
                  numberOfAvailableAndBookedSlots !== 0
                ? `available`
                : null;

            this.daysConfigrations.push({
              date: new Date(date),
              subTitle: '.',
              cssClass: cssClass + ' colored',
              disable: false
            });
          });
          return dates;
        }),
        finalize(() => refresher && refresher.target.complete())
      );
  }
}
