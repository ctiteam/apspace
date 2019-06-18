import { Component } from '@angular/core';
import {
  AlertController,
  App,
  Events,
  IonicPage,
  NavController,
  NavParams,
  Platform,
} from 'ionic-angular';

import { Role } from '../../interfaces';
import {
  SettingsProvider,
  WsApiProvider,
} from '../../providers';

interface MenuGroup {
  title: string;
  items: MenuItem[];
}

interface MenuItem {
  title: string;
  component: string;
  icon: string;
  size: string;
  desc: string;
  color: string;
  role: Role;
}

@IonicPage()
@Component({
  selector: 'page-more',
  templateUrl: 'more.html',
})
export class MorePage {
  menuFull: MenuGroup[] = [
    {
      title: 'Main',
      items: [
        {
          title: 'Profile',
          component: 'ProfilePage',
          size: 'small',
          desc: 'purple',
          color: 'purple',
          icon: 'contact',
          role: Role.Student | Role.Lecturer | Role.Admin,
        },
        {
          title: 'Fees',
          component: 'FeesPage',
          size: 'small',
          desc: 'dark-orange',
          color: 'dark-orange',
          icon: 'cash',
          role: Role.Student,
        },
        {
          title: 'Bus Tracking',
          component: 'BusTrackingPage',
          size: 'medium',
          desc: 'orange',
          color: 'orange',
          icon: 'bus',
          role: Role.Student | Role.Lecturer | Role.Admin,
        },
        {
          title: 'Holidays',
          component: 'HolidaysPage',
          size: 'small',
          desc: 'orange',
          color: 'orange',
          icon: 'bicycle',
          role: Role.Student | Role.Lecturer | Role.Admin,
        },
        {
          title: 'News',
          component: 'NewsPage',
          size: 'small',
          desc: 'green',
          color: 'green',
          icon: 'paper',
          role: Role.Student ,
        },
        {
          title: 'Knowledge Base',
          component: 'KbPage',
          size: 'medium',
          desc: 'dark-orange',
          color: 'dark-orange',
          icon: 'paper',
          role: Role.Student | Role.Lecturer | Role.Admin,
        },
        {
          title: 'Forms & Application',
          component: 'FormsApplicationPage',
          size: 'medium',
          desc: 'blue',
          color: 'blue',
          icon: 'clipboard',
          role: Role.Student | Role.Lecturer | Role.Admin,
        },
        {
          title: 'APCard',
          component: 'ApcardPage',
          size: 'small',
          desc: 'red',
          color: 'red',
          icon: 'card',
          role: Role.Student | Role.Lecturer | Role.Admin,
        },
        {
          title: 'Webmail',
          component: 'WebmailPage',
          size: 'small',
          desc: 'purple',
          color: 'purple',
          icon: 'mail',
          role: Role.Student
        },
        {
          title: 'APLC Progress Report',
          component: 'HomeProgressReportPage',
          size: 'large',
          desc: 'purple',
          color: 'purple',
          icon: 'card',
          role: Role.Lecturer | Role.Admin,
        },
      ],
    },
    {
      title: 'Course Related',
      items: [
        {
          title: 'Results',
          component: 'ResultsPage',
          size: 'small',
          desc: 'red',
          color: 'red',
          icon: 'checkbox',
          role: Role.Student,
        },
        {
          title: 'iConsult',
          component: 'UpcominglecPage',
          size: 'small',
          desc: 'green',
          color: 'green',
          icon: 'clipboard',
          role: Role.Lecturer | Role.Admin,
        },
        // {
        //   title: 'Student Consent Form',
        //   component: 'StudentConsentFormlPage',
        //   size: 'large',
        //   desc: 'orange',
        //   color: 'orange',
        //   icon: 'create',
        //   role: Role.Lecturer | Role.Admin,
        // },
        {
          title: 'iConsult',
          component: 'UpcomingstdPage',
          size: 'medium',
          desc: 'green',
          color: 'green',
          icon: 'clipboard',
          role: Role.Student,
        },
        {
          title: 'Timetable',
          component: 'TimetablePage',
          size: 'small',
          desc: 'orange',
          color: 'orange',
          icon: 'clipboard',
          role: Role.Student,
        },
        {
          title: 'Exam Schedule',
          component: 'ExamSchedulePage',
          size: 'medium',
          desc: 'purple',
          color: 'purple',
          icon: 'book',
          role: Role.Student | Role.Lecturer | Role.Admin,
        },
        {
          title: 'My Library',
          component: 'KohaPage',
          size: 'medium',
          desc: 'blue',
          color: 'blue',
          icon: 'bookmarks',
          role: Role.Student | Role.Lecturer | Role.Admin,
        },
        {
          title: 'Student Timetable',
          component: 'TimetablePage',
          size: 'medium',
          desc: 'red',
          color: 'red',
          icon: 'calendar',
          role: Role.Lecturer | Role.Admin,
        },
        {
          title: 'Moodle (Course Material)',
          component: 'LmsPage',
          size: 'large',
          desc: 'dark-orange',
          color: 'dark-orange',
          icon: 'open',
          role: Role.Student | Role.Lecturer | Role.Admin,
        },
        {
          title: 'Attendance',
          component: 'AttendancePage',
          size: 'small',
          desc: 'orange',
          color: 'orange',
          icon: 'alarm',
          role: Role.Student,
        },
        {
          title: 'Student Survey',
          component: 'SubmitSurveyPage',
          size: 'medium',
          desc: 'green',
          color: 'green',
          icon: 'alarm',
          role: Role.Student,
        },
      ],
    },
    {
      title: 'Others',
      items: [
        {
          title: 'Upcoming Graduations',
          component: 'GraduationsPage',
          size: 'xlarge',
          desc: 'orange',
          color: ' orange',
          icon: 'school',
          role: Role.Student | Role.Lecturer | Role.Admin,
        },
        {
          title: 'Graduate Verification Service',
          component: 'QualificationVerificationPage',
          size: 'large',
          desc: 'blue',
          color: ' blue',
          icon: 'document',
          role: Role.Student | Role.Lecturer | Role.Admin,
        },
        {
          title: 'Visa Renewal Status',
          component: 'VisaRenewalStatusPage',
          size: 'small',
          desc: 'red',
          color: ' red',
          icon: 'md-globe',
          role: Role.Student,
        },
        {
          title: 'Staff Directory',
          component: 'StaffDirectoryPage',
          size: 'medium',
          desc: 'dark-orange',
          color: 'dark-orange',
          icon: 'people',
          role: Role.Student | Role.Lecturer | Role.Admin,
        },
        {
          title: 'Classroom Finder',
          component: 'ClassroomFinderPage',
          size: 'medium',
          desc: 'purple',
          color: 'purple',
          icon: 'search',
          role: Role.Student | Role.Lecturer | Role.Admin,
        },
        {
          title: 'Operation Hours',
          component: 'OperationHoursPage',
          size: 'medium',
          desc: 'green',
          color: 'green',
          icon: 'information-circle',
          role: Role.Student | Role.Lecturer | Role.Admin,
        },
        {
          title: 'Notification',
          component: 'NotificationPage',
          size: 'small',
          desc: 'orange',
          color: 'orange',
          icon: 'notifications',
          role: Role.Student | Role.Lecturer | Role.Admin,
        },
        {
          title: 'Feedback',
          component: 'FeedbackPage',
          size: 'small',
          desc: 'green',
          color: 'green',
          icon: 'at',
          role: Role.Student | Role.Lecturer | Role.Admin,
        },
        {
          title: 'Settings',
          component: 'SettingsPage',
          icon: 'settings',
          size: 'small',
          desc: 'blue',
          color: 'blue',
          role: Role.Student | Role.Lecturer | Role.Admin,
        },
        {
          title: 'Logout',
          component: 'LogoutPage',
          icon: 'log-out',
          size: 'large',
          desc: 'red',
          color: 'red',
          role: Role.Student | Role.Lecturer | Role.Admin,
        },
      ],
    },
  ];

  menuFiltered: MenuGroup[] = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public ws: WsApiProvider,
    public alertCtrl: AlertController,
    public events: Events,
    public app: App,
    public settings: SettingsProvider,
    public plt: Platform,
  ) {
    this.setMenuItems();
  }

  setMenuItems() {
    const role = this.settings.get('role');
    this.menuFiltered = this.menuFull
      .map(({ title, items }) => ({
        title,
        items: items.filter(page => page.role & role),
      }))
      .filter(group => group.items.length > 0);
  }

  filterMenu(event: any) {
    this.setMenuItems();
    const val = event.target.value;
    if (val && val.trim() !== '') {
      this.menuFiltered = this.menuFiltered
        .map(({ title, items }) => ({
          title,
          items: items.filter(
            page =>
              page.title.toLowerCase().includes(val.toLowerCase()) ||
              page.desc.toLowerCase().includes(val.toLowerCase()),
          ),
        }))
        .filter(group => group.items.length > 0);
    }
  }

  openPage(page) {
    if (page.component == 'LogoutPage') {
      this.logout();
    } else {
      this.app.getRootNav().push(page.component);
    }
  }

  logout() {
    this.alertCtrl
      .create({
        title: 'Confirm Log out',
        message: 'Do you want to log out?',
        buttons: [
          { text: 'Cancel', role: 'cancel' },
          {
            text: 'Log out',
            handler: () => {
              this.events.publish('user:logout');
            },
          },
        ],
      })
      .present();
  }
}
