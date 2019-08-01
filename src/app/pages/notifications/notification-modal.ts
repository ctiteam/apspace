import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { NavParams, ModalController } from '@ionic/angular';

@Component({
    selector: 'page-notification-modal',
    templateUrl: 'notification-modal.html',
    styleUrls: ['notification-modal.scss']
})
export class NotificationModalPage implements OnInit {
    message: any;
    constructor(
        private sanitizer: DomSanitizer,
        public params: NavParams,
        private modalCtrl: ModalController
    ) {
        this.message = this.params.get('message');
    }
    sanitize(value: string): SafeHtml {
        return this.sanitizer.bypassSecurityTrustHtml(value);
    }
    ngOnInit() {
    }
    dismiss() {
        this.modalCtrl.dismiss();
    }
}
