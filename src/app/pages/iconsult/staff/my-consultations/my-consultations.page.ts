import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { WsApiService } from 'src/app/services';
import { LecturerConsultation } from 'src/app/interfaces';
import { map, tap } from 'rxjs/operators';

import * as moment from 'moment';
import { CalendarComponentOptions, DayConfig } from 'ion2-calendar';
import { ModalController } from '@ionic/angular';
import { ConsultationsSummaryModalPage } from './modals/summary/summary-modal';


@Component({
  selector: 'app-my-consultations',
  templateUrl: './my-consultations.page.html',
  styleUrls: ['./my-consultations.page.scss'],
})
export class MyConsultationsPage implements OnInit {
  slots$: Observable<{}>;
  todaysDate = this.iconsultFormatDate(new Date());

  summaryDetails = {
    totalOpenedSlots: 0, // -1 to show the loading until it is not -1
    totalAvailableSlots: 0,
    totalClosedSlots: 0,
    totalUnavailalbeSlots: 0,
    totalBookedSlots: 0,
  };

  skeltonArray = new Array(4);

  daysConfigrations: DayConfig[] = [];
  dateToFilter = this.todaysDate;
  options: CalendarComponentOptions = {
    from: new Date(),
    to: null,
    daysConfig: this.daysConfigrations
  };

  constructor(
    private ws: WsApiService,
    private modalCtrl: ModalController
  ) { }

  iconsultFormatDate(date: Date) {
    return moment(date).format('YYYY-MM-DD');
  }

  async showSummary() {
    const modal = await this.modalCtrl.create({
      component: ConsultationsSummaryModalPage,
      cssClass: 'add-min-height',
      componentProps: { summaryDetails: this.summaryDetails , notFound: 'No slot Selected' },
    });
    await modal.present();
    await modal.onDidDismiss();
  }

  ngOnInit() {
    this.getData();
  }

  getData() { // to be changed with refresher
    this.slots$ = this.ws.get<LecturerConsultation[]>('/iconsult/upcomingconlec', true).pipe(
      map(
        slots => slots.reduce((r, a) => {
          if (a.status === 'Unavailable') {
            this.summaryDetails.totalUnavailalbeSlots++;
          }
          if (a.status === 'Clossed') {
            this.summaryDetails.totalClosedSlots++;
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
          const consultationsDate = a.dateandtime.split(' ')[0]; // Grouping the slots
          r[consultationsDate] = r[consultationsDate] || {};
          r[consultationsDate].items = r[consultationsDate].items || [];
          r[consultationsDate].items.push(a);
          return r;
        }, {})
      ),
      tap(dates => {
        Object.keys(dates).forEach(
          date => {
            const items = dates[date].items;
            const numberOfAvailableAndBookedSlots = items.filter(item => item.status === 'Available' || item.status === 'Booked').length;
            const numberOfBookedSlots = items.filter(item => item.status === 'Booked').length;
            const hasClosedSlot = items.some(item => item.status === 'Clossed');
            let cssClass = numberOfAvailableAndBookedSlots === numberOfBookedSlots && numberOfBookedSlots > 0
              ? `booked`
              : numberOfBookedSlots > 0
                ? `partially-booked`
                : numberOfBookedSlots === 0 && numberOfAvailableAndBookedSlots !== 0
                  ? `available`
                  : 'unavailable';

            cssClass += hasClosedSlot ? ' clossed' : '';
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
