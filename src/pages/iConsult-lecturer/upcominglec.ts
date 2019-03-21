import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { AlertController, App, DateTime, IonicPage, NavController, NavParams, FabContainer, ToastController } from 'ionic-angular';
import moment from 'moment';
import { Observable } from 'rxjs/Observable';
import { finalize } from 'rxjs/operators';
import { UpcomingConLecProvider } from '../../providers/upcoming-con-lec';
import { TabsPage } from '../tabs/tabs';
import { SlotsProvider } from '../../providers';

@IonicPage()
@Component({
  selector: 'page-upcominglec',
  templateUrl: 'upcominglec.html',
})
export class UpcominglecPage {

  slotid = this.navParams.get('slotid');
  slots$: Observable<any[]>;
  slotsRules: any;
  items: any;
  currentDateTime: string = moment().format();
  skeletonArray = new Array(5);
  currenttime = moment().format('YYYY-MM-DD HH:mm:ss');
  fabButtonOpened: Boolean;
  status: number = 1;
  canceledslots: any;

  constructor(
    public http: HttpClient,
    public navCtrl: NavController,
    public navParams: NavParams,
    private UpcomingConLec: UpcomingConLecProvider,
    public app: App,
    public alertCtrl: AlertController,
    public slotsProvider: SlotsProvider,
    private toastCtrl: ToastController,
  ) {
    this.fabButtonOpened = false;
  }

  ionViewDidLoad() {
    this.slots$ = this.UpcomingConLec.getUpcomingConLec();
  }

  doRefresh(refresher?) {
    this.slots$ = this.UpcomingConLec.getUpcomingConLec().pipe(
      finalize(() => refresher.complete()),
    );
  }

  openFabButton() {
    if (this.fabButtonOpened == false) {
      this.fabButtonOpened = true;
    } else {
      this.fabButtonOpened = false;
    }
  }

  closeFabButton(fab: FabContainer) {
    fab.close();
    if (this.closeFabButton) {
      this.fabButtonOpened = false;
    }
  }

  getUpcomingConLec() {
    this.UpcomingConLec.getUpcomingConLec().subscribe((res => {
      this.slotsRules = res;
    }));
  }

  openDetailPage(
    id: number,
    status: string,
    availibilityid: number,
    date: string,
    time: string,
    timee: string,
    datetime: string,
  ) {
    this.app.getRootNav().push('ConsuldetailpagePage',
      { id, status, availibilityid, date, time, timee, datetime });
  }

  closeAvailableSlots(
    id: number,
    slotid: number,
    date: string,
    time: string,
    timee: string,
    datetime: string,
    venue: string,
    location: string,
    endTime: string,
  ) {
    this.canceledslots = {
      availibility_id: id,
      slotid: slotid,
      date: date,
      timee: timee,
      datetime: '',
      cancelled_datetime: this.currentDateTime,
      status: this.status,
    };
    this.closelslot();
  }

  async closelslot() {
    const alert = await this.alertCtrl.create({
      title: 'Close Slot',
      message: 'Are you sure you want to close this open slot?',
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

  openUnavailabledetailsPage(unavailibilityid: number) {
    this.app.getRootNav().push('UnavailabledetailsPage', { unavailibilityid });
  }

  gotoChat() {
    // link to  MS Temas webpage
    window.open('https://products.office.com/en-us/microsoft-teams/group-chat-software', '_system');
  }

}
