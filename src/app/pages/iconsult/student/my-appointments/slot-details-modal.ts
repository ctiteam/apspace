import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'page-slot-details-modal',
  templateUrl: 'slot-details-modal.html',
  styleUrls: ['slot-details-modal.scss']
})
export class SlotDetailsModalPage implements OnInit {
  booking;

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }
}
