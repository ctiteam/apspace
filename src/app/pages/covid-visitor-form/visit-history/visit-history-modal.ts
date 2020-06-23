import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
@Component({
  selector: 'page-visit-history-modal',
  templateUrl: 'visit-history-modal.html',
  styleUrls: ['visit-history-modal.scss']
})

export class VisitHistoryModalPage {

  constructor(
    private modalCtrl: ModalController,
  ) { }

  dismiss() {
    this.modalCtrl.dismiss();
  }
}
