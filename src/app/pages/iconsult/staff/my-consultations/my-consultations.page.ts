import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AlertController, LoadingController, ModalController, ToastController
} from '@ionic/angular';
import { Observable, forkJoin } from 'rxjs';
import { finalize, map, tap } from 'rxjs/operators';

import { CalendarComponentOptions, DayConfig } from 'ion2-calendar';

import { ConsultationHour, ConsultationSlot } from 'src/app/interfaces';
import { WsApiService } from 'src/app/services';
import { LecturerSlotDetailsModalPage } from './modals/lecturer-slot-details/lecturer-slot-details-modal';
import { ConsultationsSummaryModalPage } from './modals/summary/summary-modal';
// import { UnavailabilityDetailsModalPage } from './modals/unavailability-details/unavailability-details-modal';
// import { toastMessageEnterAnimation } from 'src/app/animations/toast-message-animation/enter';
// import { toastMessageLeaveAnimation } from 'src/app/animations/toast-message-animation/leave';

// GET SLOT ID FOR CANCEL SLOT PURPOSE

@Component({
  selector: 'app-my-consultations',
  templateUrl: './my-consultations.page.html',
  styleUrls: ['./my-consultations.page.scss'],
  providers: [DatePipe]
})
export class MyConsultationsPage {
  url = 'https://iuvvf9sxt7.execute-api.ap-southeast-1.amazonaws.com/staging';
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

  // testTime = '2019-12-02T18:00:00+08:00';

  daysConfigrations: DayConfig[] = []; // ion-calendar plugin
  options: CalendarComponentOptions = {
    from: new Date(),
    to: null, // null to disable all calendar button. Days configurations will enable only dates with slots
    daysConfig: this.daysConfigrations
  };

  dateRange: { from: string; to: string; };
  optionsRange: CalendarComponentOptions = {
    pickMode: 'range'
  };
  onSelect = false; // enable or disable select more than one slot to cancel.
  onRange = false; // enable or disable select date range to perform bulk delete.
  slotsToBeCancelled: ConsultationSlot[] = [];

  constructor(
    private ws: WsApiService,
    private modalCtrl: ModalController,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private toastCtrl: ToastController,
    private route: ActivatedRoute,
    private router: Router,
    private datePipe: DatePipe
  ) { }

  async showSummary() {
    // summary modal
    const modal = await this.modalCtrl.create({
      component: ConsultationsSummaryModalPage,
      componentProps: { summaryDetails: this.summaryDetails }
    });
    await modal.present();
    await modal.onDidDismiss();
  }

  async openSlotDetailsModal(slot: ConsultationSlot) {
    const modal = await this.modalCtrl.create({
      component: LecturerSlotDetailsModalPage,
      cssClass: 'add-min-height',
      componentProps: { slot, notFound: 'No slot Selected' }
    });
    await modal.present();
    await modal.onDidDismiss().then(data => {
      if (data.data === 'SUCCESS') {
        this.daysConfigrations = [];
        this.doRefresh();
      }
    });
  }

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

  toggleCancelSlot() {
    this.onSelect = !this.onSelect;

    if (this.onRange === true) {
      this.onRange = false;
    }
  }

  toggleCancelSlotOptions() {
    this.onRange = !this.onRange;
  }

  getSelectedSlot(slot: ConsultationSlot) {
    if (!(this.slotsToBeCancelled.find(slotTBC => slotTBC.slot_id === slot.slot_id))) {
      this.slotsToBeCancelled.push(slot);
    } else {
      this.slotsToBeCancelled.forEach((slotTBC, index, slotsToBeCancelled) => {
        if (slotTBC.slot_id === slot.slot_id) {
          slotsToBeCancelled.splice(index, 1);
        }
      });
    }
  }

  getSelectedRangeSlot(dates) {
    this.slotsToBeCancelled = [];
    const startDate = new Date(this.dateRange.from);
    const endDate = new Date(this.dateRange.to);

    const datesKeys = Object.keys(dates).map(date => new Date(date));
    const filteredDates = datesKeys.filter(date => startDate <= date && date <= endDate);

    filteredDates.forEach(filteredDate => {
      const currentDateString = this.datePipe.transform(filteredDate, 'yyyy-MM-dd', '+0800');
      dates[currentDateString].items.forEach(item => this.slotsToBeCancelled.push(item));
    });
  }

  resetSelectedSlots(dates) {
    if (!this.onRange) {
      const datesKeys = Object.keys(dates);
      datesKeys.forEach(datesKey => dates[datesKey].items.forEach(item => delete item.isChecked));
    }
    this.slotsToBeCancelled = [];
  }

  createAlertMessage(slotsToBeCancelled) {
    const filteredTimes = [] as { date: string; times: string[]; }[];

    slotsToBeCancelled.forEach(slotTBC => {
      const startDate = this.datePipe.transform(slotTBC.start_time, 'yyyy-MM-dd', '+0800');
      const startTime = this.datePipe.transform(slotTBC.start_time, 'HH:mm', '+0800');

      if (!(filteredTimes.find(filteredTime => filteredTime.date === startDate))) {
        filteredTimes.push({ date: startDate, times: [startTime] });
      } else {
        filteredTimes.forEach(filteredTime => {
          if (filteredTime.date === startDate) {
            filteredTime.times.push(startTime);
          }
        });
      }
    });

    return filteredTimes.map(filteredTime => {
      const timeList = filteredTime.times.join(', ');
      return `<p><strong>${filteredTime.date}: </strong>${timeList}</p>`;
    }).join('');
  }

  async cancelAvailableSlot() {
    if (this.slotsToBeCancelled) {
      const bookedSlots = this.slotsToBeCancelled.filter(slotToBeCancelled => slotToBeCancelled.booking_detail);
      const notBookedSlots = this.slotsToBeCancelled.filter(slotToBeCancelled => !slotToBeCancelled.booking_detail);

      if (bookedSlots.length > 0) {
        const cancelBookedSlotDetails = this.createAlertMessage(bookedSlots);

        let cancelAvailableSlotDetails;
        notBookedSlots.length > 0
        ? cancelAvailableSlotDetails = `<ion-icon name="checkbox-outline"></ion-icon>${this.createAlertMessage(notBookedSlots)}`
        : cancelAvailableSlotDetails = '';

        const alertBooked = await this.alertController.create({
          header: 'Warning',
          subHeader: 'You have booked slots that you\'re about to cancel. Do you want to continue? :',
          message: `<ion-icon name="calendar"></ion-icon>${cancelBookedSlotDetails}<br />
                    ${cancelAvailableSlotDetails}`,
          buttons: [
            {
              text: 'No',
              role: 'cancel',
              handler: () => { }
            }, {
              text: 'Yes',
              handler: () => {
                this.alertController.create({
                  header: 'Cancelling Appointment',
                  subHeader: 'Please provide us with the cancellation reason:',
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
                    },
                    {
                      text: 'Submit',
                      handler: (data) => {
                        if (!data.cancellationReason) {
                          this.showToastMessage('Cancellation Reason is Required !!', 'danger');
                        } else {
                          this.presentLoading();

                          const listApiToForkJoin = [];

                          const cancellationBookedBody = bookedSlots.reduce((previous, current) => {
                            previous.push({
                              booking_id: current.booking_detail.id,
                              remark: data.cancellationReason
                            });

                            return previous;
                          }, []);

                          listApiToForkJoin.push(this.sendCancelBookingRequest(cancellationBookedBody));

                          if (notBookedSlots.length > 0) {
                            const cancellationAvailableBody = notBookedSlots.reduce((previous, current) => {
                              previous.push({
                                slot_id: current.slot_id
                              });

                              return previous;
                            }, []);

                            listApiToForkJoin.push(this.sendCancelSlotRequest(cancellationAvailableBody));
                          }

                          forkJoin(listApiToForkJoin).subscribe(
                            {
                              next: () => {
                                this.daysConfigrations = [];
                                this.slotsToBeCancelled = [];
                                this.dateToFilter = undefined;
                                this.onSelect = false;
                                this.onRange = false;
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
                            }
                          );
                        }
                      }
                    }
                  ]
                }).then(alertCancelBooked => alertCancelBooked.present());
              }
            }
          ]
        });
        await alertBooked.present();
      } else {
        const cancelTimeDetails = this.createAlertMessage(notBookedSlots);

        const alert = await this.alertController.create({
          header: 'Cancelling an opened slot',
          subHeader: 'You are about to cancel these selected slots:',
          message: cancelTimeDetails,
          buttons: [
            {
              text: 'Dismiss',
              role: 'cancel',
              handler: () => { }
            }, {
              text: 'Cancel Slot',
              handler: () => {
                this.presentLoading();

                const cancellationBody = notBookedSlots.reduce((previous, current) => {
                  previous.push({
                    slot_id: current.slot_id
                  });

                  return previous;
                }, []);

                this.sendCancelSlotRequest(cancellationBody).subscribe({
                  next: () => {
                    this.daysConfigrations = [];
                    this.slotsToBeCancelled = [];
                    this.dateToFilter = undefined;
                    this.onSelect = false;
                    this.onRange = false;
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
    }
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

  sendCancelBookingRequest(cancelBookingDetails: any) {
    return this.ws.put<any>('/iconsult/booking/cancel?', {
      url: this.url,
      body: cancelBookingDetails,
    });
  }

  sendCancelSlotRequest(slotsId: any) {
    return this.ws.put<any>('/iconsult/slot/cancel?', {
      url: this.url,
      body: slotsId
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


    // FORK JOIN WITH BOOKINGS AND SLOTS
    this.slots$ = forkJoin([
      this.ws.get<ConsultationSlot[]>('/iconsult/slots?',
        {
          url: this.url
        }
      ),
      this.ws.get<ConsultationHour[]>('/iconsult/bookings?', {
        url: this.url
      })
    ]).pipe(
      map(([slots, bookings]) =>
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

            const getBooking = bookings.filter(data => data.status === 'Booked' && a.slot_id === data.slot_id);

            if (getBooking.length > 0) {
              a.booking_detail = getBooking[0];
            }

            const consultationsDate = this.datePipe.transform(
              a.start_time,
              'yyyy-MM-dd',
              '+0800'
            );
            r[consultationsDate] = r[consultationsDate] || {};
            r[consultationsDate].items = r[consultationsDate].items || [];
            r[consultationsDate].items.push(a);
          }
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

        // const getTodayConsultationsDate = this.datePipe.transform(
        //   new Date(),
        //   'yyyy-MM-dd',
        //   '+0800'
        // );

        // if (dates[getTodayConsultationsDate] !== undefined) {
        //   this.dateToFilter = this.todaysDate;
        // }

        return dates;
      }),
      finalize(() => refresher && refresher.target.complete())
    );
  }
}
