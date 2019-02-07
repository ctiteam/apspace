import { Component } from '@angular/core';
import { App, IonicPage, NavController, NavParams } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { finalize } from 'rxjs/operators';
import { UpcomingConStuProvider } from '../../providers/upcoming-con-stu';

@IonicPage()
@Component({
  selector: 'page-iconsult',
  templateUrl: 'iconsult.html',
})
export class IconsultPage {

  casId = this.navParams.get('casId');
  EMAIL = this.navParams.get('EMAIL');
  slots$: Observable<any[]>;
  staffName$: Observable<any>;
  slotsRules: any;
  staffname: any;
  skeletonArray = new Array(5);

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private UpcomingConStu: UpcomingConStuProvider,
    public app: App,
  ) { }

  ionViewDidLoad() {
    this.slots$ = this.UpcomingConStu.getSlots(this.casId);
    this.staffName$ = this.UpcomingConStu.getstaffname(this.casId);
  }

  getSlots(staffEmail) {
    this.UpcomingConStu.getSlots(staffEmail).subscribe((res => {
      this.slotsRules = res;
    }));
  }

  openBookingPage(id: number, date: string, time: string,
    datetime: string, datetimee: string, endtime: string, lecid: string, casid: string) {
    this.app.getRootNav().push('ConsultationFormPage',
      { id, date, time, datetime, datetimee: datetime, endtime, lecid, casid });
  }

  doRefresh(refresher?) {
    this.slots$ = this.UpcomingConStu.getSlots(this.casId).pipe(
      finalize(() => refresher.complete()),
    );
    this.staffName$ = this.UpcomingConStu.getstaffname(this.casId).pipe(
      finalize(() => refresher.complete()),
    );
  }

}
