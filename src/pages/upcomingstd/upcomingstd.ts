import { Component } from '@angular/core';
import { AlertController, App, IonicPage, NavController, NavParams } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { finalize } from 'rxjs/operators';
import { UpcomingConStuProvider } from '../../providers/upcoming-con-stu';
import { InAppBrowser } from '@ionic-native/in-app-browser';

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
    private iab: InAppBrowser
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

  gotoChat(lecname: string) {
    this.iab.create(`https://teams.microsoft.com/_#/apps/a2da8768-95d5-419e-9441-3b539865b118/search?q=?${lecname}`, '_blank', 'location=true');
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
