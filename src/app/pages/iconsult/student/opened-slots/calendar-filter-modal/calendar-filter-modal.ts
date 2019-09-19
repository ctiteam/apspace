import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'page-calendar-filter-modal',
  templateUrl: 'calendar-filter-modal.html',
  styleUrls: ['calendar-filter-modal.scss']
})
export class CalendarFilterModalPage {
  options: any; // the value coming from the main page (opened slots page)
  dateToFilter = '';

  constructor(private modalCtrl: ModalController) { }

  dateChosen() {
    this.modalCtrl.dismiss(this.dateToFilter);
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }

}
