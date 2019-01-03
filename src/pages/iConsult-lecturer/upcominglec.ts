import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { AlertController, App, IonicPage, NavController, NavParams } from 'ionic-angular';
import moment from 'moment';
import { Observable } from 'rxjs/Observable';
import { finalize } from 'rxjs/operators';
import { UpcomingConLecProvider } from '../../providers/upcoming-con-lec';

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
  dateString = moment().format();

  constructor(
    public http: HttpClient,
    public navCtrl: NavController,
    public navParams: NavParams,
    private UpcomingConLec: UpcomingConLecProvider,
    public app: App,
    public alertCtrl: AlertController,
  ) {

  }

  ionViewDidLoad() {
    this.slots$ = this.UpcomingConLec.getUpcomingConLec();
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

  openAvailableslotspage(
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
    this.app.getRootNav().push('FreeslotsdetailsPage',
      { id, slotid, date, time, timee, datetime, venue, location, endTime});
  }

  openUnavailabledetailsPage(unavailibilityid: number) {
    this.app.getRootNav().push('UnavailabledetailsPage', { unavailibilityid });
  }

  doRefresh(refresher?) {
    this.slots$ = this.UpcomingConLec.getUpcomingConLec().pipe(
      finalize(() => refresher.complete()),
    );
  }

  gotoChat() {
    // link to  MS Temas webpage
    window.open('https://products.office.com/en-us/microsoft-teams/group-chat-software', '_system');
  }

  // add feedback
  async addfeedback(slotid: number) {
    this.app.getRootNav().push('UpcominglecPage', { slotid });
    const alert = await this.alertCtrl.create({
      title: 'Remarks',
      inputs: [
        {
          name: 'remarks',
          placeholder: 'Please provide remarks',
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Submit',
          handler: data => {

            const feedback = {
              slotid,
              entry_datetime: this.currentDateTime,
              feedback: data.remarks,
            };

            this.UpcomingConLec.addlecFeedback(feedback).subscribe(
              () => {
                this.navCtrl.setRoot(UpcominglecPage);
              },
            );
          },
        },
      ],
    });
    await alert.present();
  }

}
