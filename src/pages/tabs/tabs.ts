import { Component } from '@angular/core';
import { IonicPage, NavParams, NavController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { Storage } from '@ionic/storage';

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

  staffTabs: Array<{
    title: string,
    icon: any,
    root: any
  }>;

  lecturerTabs: Array<{
    title: string,
    icon: any,
    root: any
  }>;

  loaded: boolean = false;
  tabIndex: number = 0;
  
  constructor(
    public navParams: NavParams,
    public statusBar: StatusBar,
    public navCtrl: NavController,
    private storage: Storage) {

    this.tabs = [
      { title: 'News', icon: 'md-home', root: 'HomePage' },
      { title: 'Timetable', icon: 'md-calendar', root: 'TimetablePage' },
      { title: 'Attendance', icon: 'md-alarm', root: 'AttendancePage' },
      { title: 'APCard', icon: 'md-card', root: 'ApcardPage' },
      { title: 'More', icon: 'ios-more', root: 'MorePage' },
    ]

    this.staffTabs = [
      { title: 'News', icon: 'md-home', root: 'HomePage' },
      { title: 'APCard', icon: 'md-card', root: 'ApcardPage' },
      { title: 'More', icon: 'ios-more', root: 'MorePage' },
    ]

    this.lecturerTabs = [
      { title: 'News', icon: 'md-home', root: 'HomePage' },
      { title: 'Timetable', icon: 'md-calendar', root: 'TimetablePage' },
      { title: 'APCard', icon: 'md-card', root: 'ApcardPage' },
      { title: 'More', icon: 'ios-more', root: 'MorePage' },
    ]
    // this.storage.get('userGroup').then((val) => {
    //   this.userGroup = val;
    //   if(this.userGroup.indexOf('ou=students') > -1){
    //     // this.tabs = [
    //     //   { title: 'News', icon: 'md-home', root: 'HomePage' },
    //     //   { title: 'Timetable', icon: 'md-calendar', root: 'TimetablePage' },
    //     //   { title: 'Attendance', icon: 'md-alarm', root: 'AttendancePage' },
    //     //   { title: 'APCard', icon: 'md-card', root: 'ApcardPage' },
    //     //   { title: 'More', icon: 'ios-more', root: 'MorePage' },
    //     // ]
    //     this.student = true;
    //   }
    // });
  }

  ionViewDidLoad() {
    this.statusBar.backgroundColorByHexString('#4da9ff');
  }
}
