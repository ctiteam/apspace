import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
@Component({
  selector: 'page-request-update-modal-modal',
  templateUrl: 'request-update-modal.html',
  styleUrls: ['request-update-modal.scss']
})

export class RequestChangeModalPage {
  selectedClassCode: string;
  selectedClassType: string;

  /* input from classes page */
  classTypes: string[];
  classCodes: {value: string, matches: number }[];

  constructor(
    private modalCtrl: ModalController,
  ) { }

  done() {
    this.modalCtrl.dismiss({ code: this.selectedClassCode, type: this.selectedClassType });
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }
}
