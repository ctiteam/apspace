import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
// import { Observable } from 'rxjs';

// import { WsApiService } from 'src/app/services';
@Component({
  selector: 'page-dress-code-reminder-modal',
  templateUrl: 'dress-code-reminder-modal.html',
  styleUrls: ['dress-code-reminder-modal.scss']
})

export class DressCodeReminderModalPage implements OnInit {
  // roomsList$: Observable<any>;
  zone = '';
  constructor(
    private modalCtrl: ModalController,
    private alertCtrl: AlertController
    // private ws: WsApiService
  ) { }

  ngOnInit() {
    // this.roomsList$ = this.ws.get('/qr_code/attendee');
  }

  async presentAlert(header: string, subHeader: string, message: string, cssClass) {
    const alert = await this.alertCtrl.create({
      cssClass,
      header,
      subHeader,
      message,
      buttons: ['OK']
    });

    await alert.present();
  }

  submit() {
    const date = new Date();
    this.presentAlert('Success', 'Thank you for your confirmation', `This user has submitted the dress code form successfully on ${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} `, 'success-alert');
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }
}
