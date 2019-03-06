import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { AlertController, App, DateTime, IonicPage, NavController, NavParams, FabContainer } from 'ionic-angular';
import moment from 'moment';
import { Observable } from 'rxjs/Observable';
import { finalize } from 'rxjs/operators';
import { UpcomingConLecProvider } from '../../providers/upcoming-con-lec';
import { TabsPage } from '../tabs/tabs';

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

  constructor(
    public http: HttpClient,
    public navCtrl: NavController,
    public navParams: NavParams,
    private UpcomingConLec: UpcomingConLecProvider,
    public app: App,
    public alertCtrl: AlertController,
  ) {
    this.fabButtonOpened = false;
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

  ionViewDidLoad() {
    this.slots$ = this.UpcomingConLec.getUpcomingConLec();
  }

  doRefresh(refresher?) {
    this.slots$ = this.UpcomingConLec.getUpcomingConLec().pipe(
      finalize(() => refresher.complete()),
    );
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
      { id, slotid, date, time, timee, datetime, venue, location, endTime });
  }

  openUnavailabledetailsPage(unavailibilityid: number) {
    this.app.getRootNav().push('UnavailabledetailsPage', { unavailibilityid });
  }

  gotoChat() {
    // link to  MS Temas webpage
    window.open('https://products.office.com/en-us/microsoft-teams/group-chat-software', '_system');
  }



}
