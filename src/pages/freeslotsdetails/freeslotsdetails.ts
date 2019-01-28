import { Component } from '@angular/core';
import { AlertController, App, IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import moment from 'moment';
import { Observable } from 'rxjs/Observable';
import { SlotsProvider } from '../../providers';
import { UpcominglecPage } from '../iConsult-lecturer/upcominglec';
import { TabsPage } from '../tabs/tabs';

@IonicPage()
@Component({
  selector: 'page-freeslotsdetails',
  templateUrl: 'freeslotsdetails.html',
})
export class FreeslotsdetailsPage {

  rulesdetails$: Observable<any[]>;

  currentDateTime: string = moment().format();
  status: number = 1;

  endTime = this.navParams.get('endTime');
  availibilityId = this.navParams.get('id');
  slotid = this.navParams.get('slotid');
  date = this.navParams.get('date');
  time = this.navParams.get('time');
  timee = this.navParams.get('timee');
  datetime = this.navParams.get('datetime');
  venue = this.navParams.get('venue');
  location = this.navParams.get('location');

  canceledslots = {
    availibility_id: this.availibilityId,
    slotid: this.slotid,
    date: this.date,
    timee: this.timee,
    datetime: '',
    cancelled_datetime: this.currentDateTime,
    status: this.status,
  };

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public slotsProvider: SlotsProvider,
              public alertCtrl: AlertController,
              public app: App,
              private toastCtrl: ToastController,
  ) {
  }

  ionViewDidLoad() {
    const id = this.navParams.get('id');
    this.rulesdetails$ = this.slotsProvider.getrulesDetails(id);
  }

  // close slot
  async closelslot() {
    const alert = await this.alertCtrl.create({
      title: 'Close Slot',
      message: 'Are you sure you want to close this slot?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
        },
        {
          text: 'Yes',
          handler: () => {
            this.slotsProvider.addCanceledslot(this.canceledslots).subscribe(
              () => {
                this.app.getRootNav().setRoot(TabsPage);
                this.app.getRootNav().push(UpcominglecPage);
                this.presentToast();
              },
            );
          },
        },
      ],
    });
    await alert.present();
  }

  presentToast() {
    const toast = this.toastCtrl.create({
      message: 'Available slot was closed successfully',
      duration: 3000,
      position: 'bottom',
    });
    toast.present();
  }

}
