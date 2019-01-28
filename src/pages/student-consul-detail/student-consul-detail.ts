import { Component } from '@angular/core';
import {
  AlertController, App, IonicPage, LoadingController, NavController, NavParams, ToastController,
} from 'ionic-angular';
import moment from 'moment';
import { Observable } from 'rxjs/Observable';
import { UpcomingConStuProvider } from '../../providers';
import { TabsPage } from '../tabs/tabs';
import { UpcomingstdPage } from '../upcomingstd/upcomingstd';

@IonicPage()
@Component({
  selector: 'page-student-consul-detail',
  templateUrl: 'student-consul-detail.html',
})
export class StudentConsulDetailPage {

  detail$: Observable<any[]>;
  currentDateTime: string = moment().format();
  status: number = 0;

  availibilityId = this.navParams.get('availibilityid');
  slotid = this.navParams.get('id');
  date = this.navParams.get('date');
  timee = this.navParams.get('starttime');

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public pro: UpcomingConStuProvider,
              public alertCtrl: AlertController,
              public loadingCtrl: LoadingController,
              private toastCtrl: ToastController,
              public app: App,
  ) { }

  gotoChat() {
    this.navCtrl.push('ConsultationchatPage');
  }

  ionViewDidLoad() {
    const id1 = this.navParams.get('id');
    this.detail$ = this.pro.getDetailPageStu(id1);

  }

  // stu cancel booked slot
  async cancelslot() {
    const alert = await this.alertCtrl.create({
      title: 'Cancel Appointment',
      message: 'Are you sure you want to cancel this slot?',
      inputs: [
        {
          name: 'Cancel_reason',
          placeholder: 'Please provide Cancel reason',
        },
      ],
      buttons: [
        {
          text: 'No',
          role: 'cancel',
        },
        {
          text: 'Yes',
          handler: data => {
            if (!data.Cancel_reason) {
              const innerAlert = this.alertCtrl.create({
                message: 'Cancel reason is required.',
                buttons: [
                  {
                    text: 'Ok',
                    role: 'cancel',
                    handler: () => {
                      this.cancelslot();
                    },
                  },
                ],
              });
              innerAlert.present();
            } else {
              const cancelbookedslots = {
                availibility_id: this.availibilityId,
                slotid: this.slotid,
                date: this.date,
                timee: this.timee,
                cancelled_datetime: this.currentDateTime,
                status: this.status,
                cancel_datetime: this.currentDateTime,
                cancel_reason: data.Cancel_reason,
              };
              this.presentLoading();
              this.pro.cancelbookedslot(cancelbookedslots).subscribe(
                () => {
                  this.app.getRootNav().setRoot(TabsPage);
                  this.app.getRootNav().push(UpcomingstdPage);
                  this.presentToast();
                },
              );
            }
          },
        },
      ],
    });
    await alert.present();
  }

  presentToast() {
    const toast = this.toastCtrl.create({
      message: 'This consultation hour has been cancelled successfully',
      duration: 3000,
      position: 'bottom',
    });

    toast.present();
  }

  presentLoading() {
    const loading = this.loadingCtrl.create({
      content: 'Sending your request',
    });

    loading.present();

    setTimeout(() => {
      loading.dismiss();
    }, 2000);
  }

}
