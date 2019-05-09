import { Component } from '@angular/core';
import { AlertController, App, IonicPage, NavController, NavParams } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { finalize } from 'rxjs/operators';
import { UpcomingConStuProvider } from '../../providers/upcoming-con-stu';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { LaunchExternalAppProvider } from '../../providers';

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
    private iab: InAppBrowser,
    private launchExternalApp: LaunchExternalAppProvider
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

  gotoChat(lecCasId: string) {
    let androidSchemeUrl = 'com.microsoft.teams';
    let iosSchemeUrl = 'microsoft-teams://';
    let webUrl = `https://teams.microsoft.com/_#/apps/a2da8768-95d5-419e-9441-3b539865b118/search?q=?${lecCasId}`;
    let appStoreUrl = 'https://itunes.apple.com/us/app/microsoft-teams/id1113153706?mt=8';
    let appViewUrl = 'https://teams.microsoft.com/l/chat/0/0?users=';
    let playStoreUrl = `https://play.google.com/store/apps/details?id=com.microsoft.teams&hl=en&referrer=utm_source%3Dgoogle%26utm_medium%3Dorganic%26utm_term%3D'com.microsoft.teams'&pcampaignid=APPU_1_NtLTXJaHKYr9vASjs6WwAg`;
    this.launchExternalApp.launchExternalApp(iosSchemeUrl, androidSchemeUrl, appViewUrl, webUrl, playStoreUrl, appStoreUrl, `${lecCasId}@staffemail.apu.edu.my`);
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
