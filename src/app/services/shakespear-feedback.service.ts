import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Screenshot } from '@ionic-native/screenshot/ngx';
import { Shake } from '@ionic-native/shake/ngx';
import { Vibration } from '@ionic-native/vibration/ngx';
import { ModalController } from '@ionic/angular';

import { ShakespearModalPage } from '../pages/feedback/shakespear-modal/shakespear-modal.page';
import { CasTicketService } from './cas-ticket.service';

@Injectable({
  providedIn: 'root'
})
export class ShakespearFeedbackService {

  constructor(
    private shake: Shake,
    private modalCtrl: ModalController,
    private screenshot: Screenshot,
    private vibration: Vibration,
    private cas: CasTicketService,
    private router: Router
  ) { }

  initShakespear(sensitivity: number) {
    // tslint:disable-next-line: max-line-length
    this.shake.startWatch(sensitivity).subscribe(async () => { // "shaked" the phone, "40" is the sensitivity of the shake. The lower the better!
      if (!await this.cas.isAuthenticated()) {
        return; // Do nothing if they aren't logged in
      }
      if (this.router.url.startsWith('/feedback')) {
        return;
      }

      const modalIsOpen = await this.modalCtrl.getTop();
      if (!modalIsOpen) {
        this.screenshot.URI(100).then(async (res) => { // "100" is screenshot quality
          this.vibration.vibrate(1000); // Vibrate for 1s (1000ms)
          const modal = await this.modalCtrl.create({
            component: ShakespearModalPage,
            cssClass: 'controlled-modal',
            componentProps: {
              imagePath: res.URI
            }
          });

          await modal.present();
        });
      }
    });
  }
}
