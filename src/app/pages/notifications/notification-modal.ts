import { Component } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';

@Component({
    selector: 'page-notification-modal',
    templateUrl: 'notification-modal.html',
    styleUrls: ['notification-modal.scss']
})
export class NotificationModalPage {
    message: any;

    constructor(
        public params: NavParams,
        private modalCtrl: ModalController
    ) {
        this.message = this.params.get('message');
    }

    dismiss() {
        this.modalCtrl.dismiss();
    }
}
