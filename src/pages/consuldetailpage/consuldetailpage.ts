import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import {
  AlertController, App, IonicPage, LoadingController, NavController, NavParams, ToastController,
} from 'ionic-angular';
import moment from 'moment';
import { Observable } from 'rxjs/Observable';
import { UpcomingConLecProvider, UserserviceProvider } from '../../providers';
import { UpcominglecPage } from '../iConsult-lecturer/upcominglec';
import { TabsPage } from '../tabs/tabs';
import { InAppBrowser } from '@ionic-native/in-app-browser';

@IonicPage()
@Component({
  selector: 'page-consuldetailpage',
  templateUrl: 'consuldetailpage.html',
})
export class ConsuldetailpagePage {

  detail$: Observable<any[]>;
  feedback$: Observable<any[]>;
  currentDateTime: string = moment().format();
  currentstatus: number = 1;

  availibilityId = this.navParams.get('availibilityid');
  slotid = this.navParams.get('id');
  date = this.navParams.get('date');
  time = this.navParams.get('time');
  timee = this.navParams.get('timee');
  status = this.navParams.get('status');

  dateString = moment().format();
  loading = this.loadingCtrl.create({
  });

  lecfeedback = {
    slotid: this.slotid,
    entry_datetime: this.currentDateTime,
    feedback: '',
    gims_status: 0
  };

  constructor(
    public http: HttpClient,
    public navParams: NavParams,
    public userserviceprovider: UserserviceProvider,
    public pro: UpcomingConLecProvider,
    public alertCtrl: AlertController,
    public navCtrl: NavController,
    public app: App,
    private UpcomingConLec: UpcomingConLecProvider,
    private toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    private iab: InAppBrowser
  ) { }

  ionViewDidLoad() {
    const id1 = this.navParams.get('id');
    this.detail$ = this.pro.getDetailPage(id1);
    this.feedback$ = this.pro.getfeedback(id1);
  }

  changeTest() {
    this.lecfeedback.gims_status = +this.lecfeedback.gims_status;
  }

  // confirm copy remarks to gims
  async confirmation() {
    const alert = await this.alertCtrl.create({
      title: 'Confirm',
      message: 'Are you sure you want to add this remarks?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
        },
        {
          text: 'Yes',
          handler: () => {
            this.loading.present();
            this.UpcomingConLec.addlecFeedback(this.lecfeedback).subscribe(
              () => {
                this.loading.dismiss();
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
      message: 'Remarks was added successfully',
      duration: 3000,
      position: 'bottom',
    });

    toast.present();
  }

  // lec cancel booked slot
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
                status: this.currentstatus,
                cancel_datetime: this.currentDateTime,
                cancel_reason: data.Cancel_reason,
              };
              this.loading.present();
              this.pro.cancelbookedslot(cancelbookedslots).subscribe(
                () => {
                  this.loading.dismiss();
                  this.app.getRootNav().setRoot(TabsPage);
                  this.app.getRootNav().push(UpcominglecPage);
                  this.presentcanceledToast();
                },
              );
            }
          },
        },
      ],
    });
    await alert.present();
  }

  presentcanceledToast() {
    const toast = this.toastCtrl.create({
      message: 'This consultation hour has been canceled successfully',
      duration: 3000,
      position: 'bottom',
    });

    toast.present();
  }

  gotoChat(tpnumber: string) {
    this.iab.create(`https://teams.microsoft.com/_#/apps/a2da8768-95d5-419e-9441-3b539865b118/search?q=?${tpnumber}`, '_blank', 'location=true');
  }
}
