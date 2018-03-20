import { Observable } from 'rxjs/Observable';
import { Component, ViewChild } from '@angular/core';
import { AlertController, Events, Nav } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { NewsServiceProvider } from '../providers/news-service/news-service';
import { CasTicketProvider, WsApiProvider } from '../providers';
import { UserProfile } from '../interfaces';
import { UserPhoto } from '../interfaces/user-photo';


@Component({
  templateUrl: 'app.html',
  providers: [NewsServiceProvider]
})
export class MyApp {
  @ViewChild(Nav) navCtrl: Nav;

  activePage: any;

  pages: Array<{ title: string, component: any, icon: any }>;

  profile$: Observable<UserProfile[]>;
  photo$: Observable<UserPhoto[]>;

  constructor(
    public alertCtrl: AlertController,
    public events: Events,
    public storage: Storage,
    private cas: CasTicketProvider,
    private ws: WsApiProvider,
  ) {
    this.storage.get('tgt')
      .then(tgt => {
        if (tgt) {
          this.events.subscribe('user:logout', () => this.onLogout());        
          this.profile$ = this.ws.get<UserProfile[]>('/student/profile');
          this.photo$ = this.ws.get<UserPhoto[]>('/student/photo')
          this.navCtrl.setRoot('HomePage');
        } else {
          this.events.subscribe('user:login', () => this.onLogin());
          this.navCtrl.setRoot('LoginPage');
        }
      });

    this.pages = [
      { title: 'Home',            component: 'HomePage',           icon: 'home'        },
      { title: 'Timetable',       component: 'TimetablePage',      icon: 'calendar'    },
      { title: 'Staff Directory', component: 'StaffDirectoryPage', icon: 'people'      },
      { title: 'Results',         component: 'ResultsPage',        icon: 'checkbox'    },
      { title: 'Notification',    component: 'NotificationPage',   icon: 'chatbubbles' },
      { title: 'Feedback',        component: 'FeedbackPage',       icon: 'at'          },
    ];

    this.activePage = this.pages[0];
  }

  openPage(page) {
    this.navCtrl.setRoot(page.component);
    this.activePage = page;
  }

  onLogin() {
    this.profile$ = this.ws.get<UserProfile[]>('/student/profile');
    this.photo$ = this.ws.get<UserPhoto[]>('/student/photo');
    this.events.unsubscribe('user:login');
    this.events.subscribe('user:logout', () => this.onLogout());
  }

  onLogout() {
    this.ws.get('/student/close_session').subscribe();
    this.cas.deleteTGT().subscribe(_ => {
      // TODO: keep reusable cache
      this.storage.clear();
      this.navCtrl.setRoot('LoginPage');
      this.navCtrl.popToRoot();
    });
    this.events.unsubscribe('user:logout');
    this.events.subscribe('user:login', () => this.onLogin());
  }

  logout() {
    this.alertCtrl.create({
      title: 'Confirm logout',
      message: 'Do you want to logout?',
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        { text: 'Logout', handler: () => { this.events.publish('user:logout'); } },
      ]
    }).present();
  }

}
