import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { CalendarComponentOptions, DayConfig } from 'ion2-calendar';
import { Observable } from 'rxjs';
import { finalize, map, tap } from 'rxjs/operators';

import * as moment from 'moment';
import { ConsultationSlot, StaffDirectory } from 'src/app/interfaces';
import { WsApiService } from 'src/app/services';
import { BookSlotModalPage } from './book-slot-modal';
import { CalendarFilterModalPage } from './calendar-filter-modal/calendar-filter-modal';

@Component({
  selector: 'app-opened-slots',
  templateUrl: './opened-slots.page.html',
  styleUrls: ['./opened-slots.page.scss'],
})
export class OpenedSlotsPage {
  staffCasId: string; // NEED TO BE GLOBAL TO USE IT IN MANY FUNCTIONS
  staff$: Observable<StaffDirectory>;
  staff: StaffDirectory;
  slots$: Observable<{}>; // no type because of the grouping

  daysConfigrations: DayConfig[] = []; // ion-calendar plugin
  options: CalendarComponentOptions = {
    from: new Date(),
    to: null, // null to disable all calendar button. Days configurations will enable only dates with slots
    daysConfig: this.daysConfigrations
  };

  dateToFilter = ''; // used in the filte pipe to filter the slots by specific date

  totalAvailableSlots = -1;
  totalOpenedSlots = -1;

  skeletons = ['80%', '30%', '50%', '10%', '70%'];

  constructor(
    private route: ActivatedRoute,
    private ws: WsApiService,
    private modalCtrl: ModalController
  ) { }

  ionViewWillEnter() {
    this.staffCasId = this.route.snapshot.params.id;
    this.staff$ = this.getStaffProfile();
    this.doRefresh();
  }

  doRefresh(refresher?) { // to be changed with refresher
    this.options = {
      from: new Date(),
      to: null, // null to disable all calendar button. Days configurations will enable only dates with slots
      daysConfig: this.daysConfigrations
    };
    let totalAvailableSlots = 0;
    let totalOpenedSlots = 0;
    this.slots$ = this.ws.get<ConsultationSlot[]>('/iconsult/slots?lecturer_sam_account_name=' + this.staffCasId, {
      url: 'https://iuvvf9sxt7.execute-api.ap-southeast-1.amazonaws.com/staging'
    }).pipe(
      tap(response => console.log(response)),
      map(
        slots => slots.reduce((r, a) => { // Grouping the slots daily
          const startDate = moment(a.start_time).format('YYYY-MM-DD');
          const consultationsYearMonth = startDate.split('-')[0] + '-' + startDate.split('-')[1];
          this.totalOpenedSlots = ++totalOpenedSlots; // get the total number of opened slots
          this.totalAvailableSlots = a.status === 'Available' ? ++totalAvailableSlots : totalAvailableSlots;
          const consultationsDay = startDate;
          r[consultationsYearMonth] = r[consultationsYearMonth] || {};
          r[consultationsYearMonth][consultationsDay] = r[consultationsYearMonth][consultationsDay] || {};
          r[consultationsYearMonth][consultationsDay].items = r[consultationsYearMonth][consultationsDay].items || [];
          r[consultationsYearMonth][consultationsDay].items.push(a);

          console.log('filtered r ', r);
          return r;
        }, {})
      ),
      tap(dates => { // add css classes for slot type (used in the calendar modal)
        Object.keys(dates).forEach(
          monthYear => {
            Object.keys(dates[monthYear]).forEach(
              day => {
                const items = dates[monthYear][day].items;
                const numberOfAvailableAndBookedSlots =
                  items.filter(item => item.status === 'Available' || item.status === 'Booked').length;
                const numberOfBookedSlots = items.filter(item => item.status === 'Booked').length;
                const cssClass = numberOfAvailableAndBookedSlots === numberOfBookedSlots && numberOfBookedSlots > 0
                  ? `booked`
                  : numberOfBookedSlots > 0
                    ? `partially-booked`
                    : numberOfBookedSlots === 0 && numberOfAvailableAndBookedSlots !== 0
                      ? `available`
                      : null;

                this.daysConfigrations.push({
                  date: moment(day, 'YYYY-MM-DD').toDate(),
                  subTitle: '.',
                  cssClass: cssClass + ' colored',
                  disable: false
                });
              }
            );
          }
        );

        console.log('filtered dates ', dates);
        return dates;
      }),
      finalize(() => refresher && refresher.target.complete()),
    );
  }

  getStaffProfile() {
    return this.ws.get<StaffDirectory[]>('/staff/listing').pipe(
      map(listOfStaff => listOfStaff.find(staff => staff.ID === this.staffCasId)),
      tap(staff => this.staff = staff),
    );
  }

  async openBookingModal(slot: ConsultationSlot) {
    const dataToSend = {
      slotData: slot,
      staffData: this.staff
    };
    const modal = await this.modalCtrl.create({
      component: BookSlotModalPage,
      cssClass: 'add-min-height',
      componentProps: { dataToSend, notFound: 'No slot Selected' },
    });
    await modal.present();
    await modal.onDidDismiss().then(
      data => {
        if (data.data === 'booked') {
          this.dateToFilter = ''; // remove the filter
          this.daysConfigrations = []; // empty days configurations used in the calendar modal and then in get slots re-set it again
          this.doRefresh(true);
        }
      }
    );
  }

  async openCalendarModal() {
    const myCalendar = await this.modalCtrl.create({
      component: CalendarFilterModalPage,
      componentProps: { options: this.options }
    });
    myCalendar.present();
    const event: any = await myCalendar.onDidDismiss();
    if (event.data) { // assign the data to the dateToFilter only if there is a date returned from the modal
      this.dateToFilter = event.data;
    }
  }

}
