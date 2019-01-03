import { Component } from '@angular/core';
import { App, IonicPage, NavController, NavParams } from 'ionic-angular';
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
    // link to  MS Temas webpage
    window.open('https://products.office.com/en-us/microsoft-teams/group-chat-software', '_system');
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
