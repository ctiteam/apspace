import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { map, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { CalendarComponentOptions, DayConfig } from 'ion2-calendar';
import * as moment from 'moment';

import { WsApiService } from 'src/app/services';
import { LecturerConsultation } from 'src/app/interfaces';
import { ConsultationsSummaryModalPage } from './modals/summary/summary-modal';


@Component({
  selector: 'app-my-consultations',
  templateUrl: './my-consultations.page.html',
  styleUrls: ['./my-consultations.page.scss'],
})
export class MyConsultationsPage implements OnInit {
  slots$: Observable<{}>;
  todaysDate = this.iconsultFormatDate(new Date());

  summaryDetails = { // Group of summary data used inside the summary modal
    totalOpenedSlots: 0,
    totalAvailableSlots: 0,
    totalUnavailalbeSlots: 0,
    totalBookedSlots: 0,
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
    private modalCtrl: ModalController
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

  ngOnInit() {
    this.getData();
  }

  getData() { // to be changed with refresher
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
              cssClass,
              disable: false
            });
          }
        );
        return dates;
      })
    );
  }
}
