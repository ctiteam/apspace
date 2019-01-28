import { Component } from '@angular/core';
import { AlertController, App, IonicPage, NavController, NavParams } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { finalize } from 'rxjs/operators';
import { UpcomingConStuProvider } from '../../providers/upcoming-con-stu';

@IonicPage()
@Component({
  selector: 'page-upcomingstd',
  templateUrl: 'upcomingstd.html',
})
export class UpcomingstdPage {

  slots$: Observable<any[]>;
  slotsRules: any;
  skeletonArray = new Array(5);

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public app: App,
              private UpcomingConStu: UpcomingConStuProvider,
              public alertCtrl: AlertController,
  ) {
  }

  ionViewDidLoad() {
    this.slots$ = this.UpcomingConStu.getUpcomingConStu();
  }

  getUpcomingConStu() {
    this.UpcomingConStu.getUpcomingConStu().subscribe((res => {
      this.slotsRules = res;
    }));
  }

  gotoChat() {
    // window.open('https://play.google.com/store/apps/details?id=com.microsoft.teams', '_system');
    // let confirm = this.alertCtrl.create({
    //   title: 'Open "Microsoft Teams"?',
    //   buttons: [
    //     {
    //       text: 'No',
    //       handler: () => {
    //       }
    //     },
    //     {
    //       text: 'Yes',
    //       handler: () => {
    //         //window.open('https://play.google.com/store/apps/details?id=com.microsoft.teams', '_system');
    //         this.market.open('details?id=com.microsoft.teams');
    //       }
    //     }
    //   ]
    // });
    // confirm.present();
  }

  doRefresh(refresher?) {
    this.slots$ = this.UpcomingConStu.getUpcomingConStu().pipe(
      finalize(() => refresher.complete()),
    );
  }

  gotostaffDir() {
    this.navCtrl.push('StaffDirectoryPage');
  }

  goStaffDirectoryInfoPage(casid: number) {
    this.app.getRootNav().push('StaffDirectoryInfoPage', { id: casid });
  }

  openDetailPage(id: number, availibilityid: number, starttime: string, date: string) {
    this.app.getRootNav().push('StudentConsulDetailPage', { id, availibilityid, starttime, date });
  }

}
