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

  gotoChat(lecname: string) {
    window.open('https://teams.microsoft.com/_#/apps/a2da8768-95d5-419e-9441-3b539865b118/conversations/8:orgid:2b3a316c-0730-4a54-9ce6-a62be7fe8b84?ctx=chat&q=' + lecname, '_system');
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
