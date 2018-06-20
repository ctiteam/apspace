import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html',
})
export class TabsPage {

  tabs: Array<{
    title: string,
    icon: any,
    root: any
  }>;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams) {

      this.tabs = [
        { title: 'Home', icon: 'md-home', root: 'HomePage' },
        { title: 'Timetable', icon: 'md-calendar', root: 'TimetablePage' },
        { title: 'Attendance', icon: 'md-alarm', root: 'AttendancePage' },
        { title: 'APCard', icon: 'md-card', root: 'ApcardPage' },
        { title: 'More', icon: 'ios-more', root: 'MorePage' },
      ]
  }

  ionViewDidLoad() {}
}
