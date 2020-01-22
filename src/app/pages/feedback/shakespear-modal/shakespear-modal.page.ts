import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-shakespear-modal',
  templateUrl: './shakespear-modal.page.html',
  styleUrls: ['./shakespear-modal.page.scss'],
})
export class ShakespearModalPage implements OnInit {

  @Input() imagePath: string;

  constructor(
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }

}
