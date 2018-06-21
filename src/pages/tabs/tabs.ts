import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavParams } from 'ionic-angular';
import { SuperTabs } from 'ionic2-super-tabs';

@IonicPage()
@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html',
})
export class TabsPage {

  @ViewChild(SuperTabs) superTabs: SuperTabs;

  tabs: Array<{
    title: string,
    icon: any,
    root: any
  }>;

  constructor(public navParams: NavParams) {

    this.tabs = [
      { title: 'Home', icon: 'md-home', root: 'HomePage' },
      { title: 'Timetable', icon: 'md-calendar', root: 'TimetablePage' },
      { title: 'Attendance', icon: 'md-alarm', root: 'AttendancePage' },
      { title: 'APCard', icon: 'md-card', root: 'ApcardPage' },
      { title: 'More', icon: 'ios-more', root: 'MorePage' },
    ]
  }

  ionViewDidLoad() { }

  slideToIndex(index: number) {
    this.superTabs.slideTo(index);
  }
}
