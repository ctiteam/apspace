import { Component } from '@angular/core';
import { IonicPage, NavParams, NavController, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';

import { Role } from '../../interfaces';
import { SettingsProvider } from '../../providers';

@IonicPage()
@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html',
})
export class TabsPage {

  pages = [
    { title: 'News', icon: 'home', root: 'HomePage', role: Role.Student | Role.Lecturer | Role.Admin },
    { title: 'Timetable', icon: 'calendar', root: 'TimetablePage', role: Role.Student },
    { title: 'Timetable', icon: 'calendar', root: 'LecturerTimetablePage', role: Role.Lecturer },
    { title: 'Attendance', icon: 'alarm', root: 'AttendancePage', role: Role.Student },
    { title: 'APCard', icon: 'card', root: 'ApcardPage', role: Role.Student | Role.Lecturer | Role.Admin },
    { title: 'Bus Tracking', icon: 'bus', root: 'BusTrackingPage', role: Role.Lecturer | Role.Admin },
  ];

  morePages = { title: 'More', icon: 'ios-more', root: 'MorePage', role: Role.Student | Role.Lecturer | Role.Admin };

  tabs: Array<{
    title: string,
    icon: string,
    root: string,
    role: Role
  }>;

  constructor(
    public navParams: NavParams,
    public statusBar: StatusBar,
    public navCtrl: NavController,
    private platform: Platform,
    public settings: SettingsProvider
  ) {
    if (this.platform.is("cordova")) {
      this.statusBar.backgroundColorByHexString('#4da9ff');
    }
    const role = this.settings.get('role');
    this.tabs = this.pages.filter(page => page.role & role).slice(0, 4).concat(this.morePages);
  }
}
