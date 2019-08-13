import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { StaffDirectory, ConsultationSlot } from 'src/app/interfaces';
import { ActivatedRoute } from 'src/testing';
import { MenuController, ModalController } from '@ionic/angular';
import { WsApiService } from 'src/app/services';
import { map, tap } from 'rxjs/operators';
import { BookSlotModalPage } from './book-slot-modal';

@Component({
  selector: 'app-opened-slots',
  templateUrl: './opened-slots.page.html',
  styleUrls: ['./opened-slots.page.scss'],
})
export class OpenedSlotsPage implements OnInit {
  showDaysFilter = false;
  staffCasId: string; // NEED TO BE GLOBAL TO USE IT IN MANY FUNCTIONS
  staff$: Observable<StaffDirectory>;
  staff: StaffDirectory;
  slot$: Observable<ConsultationSlot[]>; // RESPONSE STORED HERE
  filteredSlots$: Observable<any>;  // SLOTS AFTER BEING FILTERED AND GROUPED USED FOR THE LIST OF SLOTS
  slotsUsedForDayFilterSection$: Observable<any>; // USED FOR GETTING THE DAYS IN THE FILTER SECTION
  slotsUsedForMonthFilterSection$: Observable<any>; // USED FOR GETTING THE MONTHS IN THE FILTER SECTION
  totalAvailableSlots = -1;
  totalOpenedSlots = -1;
  filterObject = {
    monthYear: '',
    day: ''
  };
  constructor(
    private route: ActivatedRoute,
    private ws: WsApiService,
    private menu: MenuController,
    private modalCtrl: ModalController,
  ) { }

  ngOnInit() {
    // this.staffCasId = this.route.snapshot.params.id;
    // this.staffCasId = 'abdallah';
    this.staffCasId = 'mohamad.alghayeb';
    this.staff$ = this.getStaffProfile();

    this.filteredSlots$ = this.getSlots().pipe(
      tap(_ => this.groupSlots())
    );
    this.slotsUsedForDayFilterSection$ = this.getSlots().pipe(
      tap(_ => this.prepareDayFilterData())
    );
    this.slotsUsedForMonthFilterSection$ = this.getSlots().pipe(
      tap(_ => this.prepareMonthFilterData())
    );
  }

  getStaffProfile() {
    return this.ws.get<StaffDirectory[]>('/staff/listing').pipe(
      map(listOfStaff => listOfStaff.find(staff => staff.ID === this.staffCasId)),
      tap(staff => this.staff = staff),
      );
  }

  getSlots() {
    return this.slot$ = this.ws.get<ConsultationSlot[]>('/iconsult/get_slots/' + this.staffCasId, true);
  }

  openMenu() {
    this.menu.enable(true, 'consultations-filter-menu');
    this.menu.open('consultations-filter-menu');
  }

  closeMenu() {
    this.menu.close('consultations-filter-menu');
  }

  clearFilter() {
    this.showDaysFilter = false;
    this.filterObject = {
      monthYear: '',
      day: ''
    };
    this.onFilter();
  }

  onFilter() {
    const month = this.filterObject.monthYear.split(' ')[0] || '';
    const year = this.filterObject.monthYear.split(' ')[1] || '';
    this.filteredSlots$ = this.slot$.pipe(
      map(slots => {
        return slots.filter(
          slot => slot.datetime.includes(this.filterObject.day) &&
            slot.datetime.includes(month) &&
            slot.date.includes(year)
        );
      }),
      map((slots: ConsultationSlot[]) => {
        return slots.reduce((r, a) => {
          const consultationsMonth = a.datetime.split(' ')[2];
          const consultationsYear = a.date.split('-')[0];
          const consultationsDay = a.datetime;

          r[consultationsYear] = r[consultationsYear] || {};
          r[consultationsYear][consultationsMonth] = r[consultationsYear][consultationsMonth] || {};
          r[consultationsYear][consultationsMonth][consultationsDay] = r[consultationsYear][consultationsMonth][consultationsDay] || [];
          r[consultationsYear][consultationsMonth][consultationsDay].push(a);
          return r;
        }, {});
      }),
    );
  }

  groupSlots() {
    this.filteredSlots$ = this.slot$.pipe(
      map((slots: ConsultationSlot[]) => {
        let totalAvailableSlots = 0;
        let totalOpenedSlots = 0;
        return slots.reduce((r, a) => {
          const consultationsMonth = a.datetime.split(' ')[2];
          const consultationsYear = a.date.split('-')[0];
          const consultationsDay = a.datetime;
          this.totalOpenedSlots = ++totalOpenedSlots;
          this.totalAvailableSlots = a.status === 'Available' ? ++totalAvailableSlots : totalAvailableSlots;

          r[consultationsYear] = r[consultationsYear] || {};
          r[consultationsYear][consultationsMonth] = r[consultationsYear][consultationsMonth] || {};
          r[consultationsYear][consultationsMonth][consultationsDay] = r[consultationsYear][consultationsMonth][consultationsDay] || [];
          r[consultationsYear][consultationsMonth][consultationsDay].push(a);
          return r;
        }, {});
      }),
    );
  }

  prepareMonthFilterData() { // TO MODIFY
    this.showDaysFilter = false;
    this.slotsUsedForMonthFilterSection$ = this.slot$.pipe(
      map((slots: ConsultationSlot[]) => {
        return slots.reduce((r, a) => {
          const consultationsMonth = a.datetime.split(' ')[2];
          const consultationsYear = a.date.split('-')[0];
          r[consultationsYear] = r[consultationsYear] || {};
          r[consultationsYear][consultationsMonth] = r[consultationsYear][consultationsMonth] || [];
          r[consultationsYear][consultationsMonth].push(a);
          return r;
        }, {});
      }),
    );
  }

  prepareDayFilterData() { // TO MODIFY
    this.filterObject.day = '';
    this.showDaysFilter = true;
    this.slotsUsedForDayFilterSection$ = this.slot$.pipe(
      map(slots => {
        return slots.filter(
          slot => slot.datetime.includes(this.filterObject.monthYear.split(' ')[0]) &&
            slot.date.includes(this.filterObject.monthYear.split(' ')[1])
        );
      }),
      map((slots: ConsultationSlot[]) => {
        return slots.reduce((r, a) => {
          const consultationsMonth = a.datetime.split(' ')[2];
          const consultationsYear = a.date.split('-')[0];
          const consultationsDay = a.datetime;
          r[consultationsYear] = r[consultationsYear] || {};
          r[consultationsYear][consultationsMonth] = r[consultationsYear][consultationsMonth] || {};
          r[consultationsYear][consultationsMonth][consultationsDay] = r[consultationsYear][consultationsMonth][consultationsDay] || [];
          r[consultationsYear][consultationsMonth][consultationsDay].push(a);
          return r;
        }, {});
      }),
    );
  }

  async openBookingModal(slot: ConsultationSlot) {
    const dataToSend = {
      slotData: slot,
      staffData: this.staff
    };
    const modal = await this.modalCtrl.create({
      component: BookSlotModalPage,
      cssClass: 'book-slot-modal',
      componentProps: { dataToSend, notFound: 'No news Selected' },
    });
    await modal.present();
    // default item to current intake if model dismissed without data
    await modal.onDidDismiss();
  }

  // TO CHECK: IF CLOSING THE CARDS IS NEEDED
  // selectedMonths: string[] = [];
  // show(monthYear: string, el: HTMLElement) {
  //   if (!this.selectedMonths.includes(monthYear)) {
  //     this.selectedMonths.push(monthYear);
  //     setTimeout(() => el.parentElement.scrollIntoView({ behavior: 'smooth' }), 100);
  //   } else {
  //     this.selectedMonths.splice(this.selectedMonths.indexOf(monthYear), 1);
  //   }
  // }
}
