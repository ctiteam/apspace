import { Component } from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  AlertController,
  Events, 
  App} from 'ionic-angular';
import { Observable } from 'rxjs/Observable';

import { WsApiProvider } from '../../providers';
import { StudentPhoto, StudentProfile } from '../../interfaces';

@IonicPage()
@Component({
  selector: 'page-more',
  templateUrl: 'more.html',
})
export class MorePage {

  pages: Array<{
    title: string,
    component: any,
    icon: any
  }>;

  photo$: Observable<StudentPhoto[]>;
  profile$: Observable<StudentProfile[]>;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public ws: WsApiProvider,
    public alertCtrl: AlertController,
    public events: Events,
    public app: App) {

    this.pages = [
      { title: 'Results', component: 'ResultsPage', icon: 'checkbox' },
      { title: 'Staff Directory', component: 'StaffDirectoryPage', icon: 'people' },
      { title: 'Fees', component: 'FeesPage', icon: 'cash' },
      { title: 'Notification', component: 'NotificationPage', icon: 'chatbubbles' },
      { title: 'Profile', component: 'ProfilePage', icon: 'contact' },
      { title: 'Operation Hours', component: 'OperationHoursPage', icon: 'information-circle' },
      { title: 'Feedback', component: 'FeedbackPage', icon: 'at' },
    ];
  }

  ionViewDidLoad() {
    this.profile$ = this.ws.get<StudentProfile[]>('/student/profile');
    this.photo$ = this.ws.get<StudentPhoto[]>('/student/photo');
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
}
