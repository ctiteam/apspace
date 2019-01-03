import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import {
  AlertController, App, IonicPage, LoadingController, NavController, NavParams, ToastController,
} from 'ionic-angular';
import moment from 'moment';
import { Observable } from 'rxjs/Observable';
import { UpcomingConLecProvider, UserserviceProvider } from '../../providers';
import { UpcominglecPage } from '../iConsult-lecturer/upcominglec';

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

  lecfeedback = {
    slotid: this.slotid,
    entry_datetime: this.currentDateTime,
    feedback: '',
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
  ) { }

  ionViewDidLoad() {
    const id1 = this.navParams.get('id');
    this.detail$ = this.pro.getDetailPage(id1);
    this.feedback$ = this.pro.getfeedback(id1);
  }

  addfeedback() {
    this.UpcomingConLec.addlecFeedback(this.lecfeedback).subscribe(
      () => {
        this.navCtrl.setRoot(UpcominglecPage);
        this.presentToast();
      },
    );
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
      title: 'Cancel booked Slot',
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
              this.presentLoading();
              this.pro.cancelbookedslot(cancelbookedslots).subscribe(
                () => {
                  this.navCtrl.setRoot(UpcominglecPage);
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
      message: 'This consultation hour has been cancelled successfully',
      duration: 3000,
      position: 'bottom',
    });

    toast.present();
  }

  presentLoading() {
    const loading = this.loadingCtrl.create({
      content: 'Please wait...',
    });

    loading.present();

    setTimeout(() => {
      loading.dismiss();
    }, 3000);
  }

}
