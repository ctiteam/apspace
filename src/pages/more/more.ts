import { Component } from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  AlertController,
  Events,
  App
} from 'ionic-angular';
import { Observable } from 'rxjs/Observable';

import { WsApiProvider, SettingsProvider } from '../../providers';
import { StudentPhoto, StudentProfile, StaffProfile, Role } from '../../interfaces';

@IonicPage()
@Component({
  selector: 'page-more',
  templateUrl: 'more.html',
})
export class MorePage {

  menuItems = [
    { title: 'Results', component: 'ResultsPage', icon: 'checkbox', role: Role.Student },
    { title: 'Staff Directory', component: 'StaffDirectoryPage', icon: 'people', role: Role.Student | Role.Lecturer | Role.Admin },
    { title: 'Bus Tracking', component: 'BusTrackingPage', icon: 'bus', role: Role.Student },
    { title: 'Student Timetable', component: 'TimetablePage', icon: 'calendar', role: Role.Lecturer },
    { title: 'Fees', component: 'FeesPage', icon: 'cash', role: Role.Student },
    { title: 'Exam Schedule', component: 'ExamSchedulePage', icon: 'book', role: Role.Student },
    { title: 'Notifications', component: 'NotificationPage', icon: 'chatbubbles', role: Role.Student },
    { title: 'Profile', component: 'ProfilePage', icon: 'contact', role: Role.Student | Role.Lecturer | Role.Admin },
    { title: 'Operation Hours', component: 'OperationHoursPage', icon: 'information-circle', role: Role.Student | Role.Lecturer | Role.Admin },
    { title: 'Feedback', component: 'FeedbackPage', icon: 'at', role: Role.Student | Role.Lecturer | Role.Admin },
  ];

  pages: Array<{
    title: string,
    component: any,
    icon: any,
    role: Role
  }>;

  photo$: Observable<StudentPhoto[]>;
  profile$: Observable<StudentProfile[]>;
  staffProfile$: Observable<StaffProfile[]>;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public ws: WsApiProvider,
    public alertCtrl: AlertController,
    public events: Events,
    public app: App,
    public settings: SettingsProvider,
  ) {
    const role = this.settings.get('role');
    this.pages = this.menuItems.filter(page => page.role & role).slice(0, 9);
  }

  ionViewDidLoad() {
    const role = this.settings.get('role');
    if (role & Role.Student) {
      this.profile$ = this.ws.get<StudentProfile[]>('/student/profile');
      this.photo$ = this.ws.get<StudentPhoto[]>('/student/photo');
    } else if (role & (Role.Lecturer || Role.Admin)) {
      this.staffProfile$ = this.ws.get<StaffProfile[]>('/staff/profile');
    }
  }

  openPage(page) {
    this.app.getRootNav().push(page.component);
  }

  openProfile() {
    this.openPage(this.pages.find(p => p.component === 'ProfilePage'));
  }

  logout() {
    this.alertCtrl
      .create({
        title: "Confirm Log out",
        message: "Do you want to log out?",
        buttons: [
          { text: "Cancel", role: "cancel" },
          {
            text: "Log out",
            handler: () => {
              this.events.publish("user:logout");
            }
          }
        ]
      })
      .present();
  }

  swipe(event) {
    const role = this.settings.get('role');
    if (role & Role.Student) {
      if (event.direction === 4) {
        this.navCtrl.parent.select(3);
      }
    } else if (role & Role.Lecturer) {
      if (event.direction === 4) {
        this.navCtrl.parent.select(1);
      }
    } else if (role & Role.Admin) {
      if (event.direction === 4) {
        this.navCtrl.parent.select(1);
      }
    }

  }
}
