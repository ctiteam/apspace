import { Component, OnInit } from '@angular/core';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import * as Fuse from 'fuse.js';
import { Observable } from 'rxjs';

import { Role } from '../../interfaces';
import { CasTicketService, SettingsService, UserSettingsService } from '../../services';

import { Network } from '@ionic-native/network/ngx';
import { NavController, ToastController } from '@ionic/angular';
import { MenuItem } from './menu.interface';

@Component({
  selector: 'app-more',
  templateUrl: './more.page.html',
  styleUrls: ['./more.page.scss'],
})
export class MorePage implements OnInit {
  view$: Observable<'list' | 'cards'>;
  term = '';

  options: Fuse.FuseOptions<MenuItem> = {
    keys: ['title', 'tags']
  };

  menuFiltered = [] as MenuItem[];

  /* tslint:disable:no-bitwise */
  menuFull: MenuItem[] = [
    {
      title: 'APCard',
      group: 'Main',
      url: 'apcard',
      img: 'assets/img/apcard.png',
      role: Role.Student | Role.Lecturer | Role.Admin,
      tags: ['transactions', 'money', 'card', 'credit', 'expenses']
    },
    {
      title: 'Bus Shuttle Services',
      group: 'Main',
      url: 'bus-shuttle-services',
      img: 'assets/img/bus-shuttle-services.png',
      role: Role.Student | Role.Lecturer | Role.Admin,
      tags: ['bus', 'trips', 'schedule']
    },
    {
      title: 'Forms & Application',
      group: 'Main',
      url: 'http://forms.sites.apiit.edu.my/home/',
      img: 'assets/img/forms-and-applications.png',
      role: Role.Student | Role.Lecturer | Role.Admin,
      tags: ['purchase', 'incident', 'maintenance', 'order', 'exit', 'event']
    },
    {
      title: 'Holidays',
      group: 'Main',
      url: 'holidays',
      img: 'assets/img/holidays.svg',
      role: Role.Student | Role.Lecturer | Role.Admin,
      tags: ['vacation', 'break']
    },
    {
      title: 'Knowledge Base',
      group: 'Main',
      url: 'http://kb.sites.apiit.edu.my/home/',
      img: 'assets/img/kb.png',
      role: Role.Student | Role.Lecturer | Role.Admin,
      tags: ['articles', 'Q&A', 'FAQ', 'questions', 'answers', 'how to']
    },
    {
      title: 'News',
      group: 'Main',
      url: 'news',
      img: 'assets/img/news.png',
      role: Role.Student | Role.Lecturer | Role.Admin,
      tags: ['events']
    },
    {
      title: 'Profile',
      group: 'Main',
      url: 'profile',
      img: 'assets/img/profile.png',
      role: Role.Student | Role.Lecturer | Role.Admin,
      tags: ['mentor', 'programme leader', 'visa']
    },
    {
      title: 'Webmail',
      group: 'Main',
      img: 'assets/img/webmail.png',
      url: 'https://outlook.office.com/owa/?realm=mail.apu.edu.my',
      role: Role.Student,
      tags: ['mail', 'email']
    },
    // {
    //   title: 'APLC Progress Report',
    //   group: 'Main',
    //   url: 'aplc-progress-report',
    //   img: 'assets/img/aplc-progress-report.png',
    //   role: Role.Lecturer | Role.Admin,
    //   tags: []
    // },
    {
      title: 'Attendance',
      group: 'Course Related',
      url: 'attendance',
      img: 'assets/img/attendance.png',
      role: Role.Student,
      tags: []
    },
    {
      title: 'Course Schedule',
      group: 'Course Related',
      url: 'http://kb.sites.apiit.edu.my/knowledge-base/course-schedule/',
      img: 'assets/img/course-schedule.png',
      role: Role.Student | Role.Lecturer | Role.Admin,
      tags: []
    },
    {
      title: 'Exam Schedule',
      group: 'Course Related',
      url: 'exam-schedule',
      img: 'assets/img/exam-schedule.png',
      role: Role.Student | Role.Lecturer | Role.Admin,
      tags: []
    },
    {
      title: 'Fees',
      group: 'Course Related',
      url: 'fees',
      img: 'assets/img/fees.svg',
      role: Role.Student,
      tags: ['payment', 'pricing', 'money', 'outstanding', 'overdue']
    },
    {
      title: 'iConsult',
      group: 'Course Related',
      img: 'assets/img/iconsult.png',
      url: 'iconsult/my-consultations',
      role: Role.Lecturer | Role.Admin,
      tags: ['consultation', 'slot']
    },
    {
      title: 'iConsult',
      group: 'Course Related',
      url: 'iconsult/my-appointments',
      img: 'assets/img/iconsult.png',
      role: Role.Student,
      tags: ['consultation', 'booking']
    },
    {
      title: 'Moodle (Course Material)',
      group: 'Course Related',
      url: 'https://lms2.apiit.edu.my/login/index.php',
      img: 'assets/img/moodle.png',
      role: Role.Student | Role.Lecturer | Role.Admin,
      tags: ['material', 'modules', 'lecturer note', 'assignment']
    },
    {
      title: 'My Library',
      group: 'Course Related',
      url: 'http://opac.apiit.edu.my/cgi-bin/koha/opac-user.pl',
      img: 'assets/img/my-library.png',
      role: Role.Student | Role.Lecturer | Role.Admin,
      tags: ['book']
    },
    {
      title: 'My Reports Panel',
      group: 'Course Related',
      url: 'https://report.apu.edu.my/jasperserver-pro/j_spring_security_check',
      img: 'assets/img/reports.png',
      role: Role.Lecturer | Role.Admin,
      tags: ['report', 'admin', 'jasper']
    },
    {
      title: 'Results',
      group: 'Course Related',
      url: 'results',
      img: 'assets/img/results.png',
      role: Role.Student,
      tags: ['marks']
    },
    {
      title: 'Timetable',
      group: 'Course Related',
      url: 'student-timetable',
      img: 'assets/img/timetable.png',
      role: Role.Student,
      tags: ['class', 'schedule', 'break']
    },
    {
      title: 'Student Timetable',
      group: 'Course Related',
      url: 'student-timetable',
      img: 'assets/img/timetable.png',
      role: Role.Lecturer | Role.Admin,
      tags: ['class', 'schedule']
    },
    {
      title: 'Classroom Finder',
      group: 'Others',
      url: 'classroom-finder',
      img: 'assets/img/classroom-finder.png',
      role: Role.Student | Role.Lecturer | Role.Admin,
      tags: ['empty', 'class', 'lab', 'auditorium', 'workshop', 'room']
    },
    {
      title: 'Graduate Verification Service',
      group: 'Others',
      url: 'graduate-verification-service',
      img: 'assets/img/graduate-verification-service.png',
      role: Role.Student | Role.Lecturer | Role.Admin,
      tags: []
    },
    {
      title: 'Operation Hours',
      group: 'Others',
      url: 'operation-hours',
      img: 'assets/img/operation-hours.png',
      role: Role.Student | Role.Lecturer | Role.Admin,
      tags: ['opening hours', 'time', 'working hours']
    },
    {
      title: 'Staff Directory',
      group: 'Others',
      url: 'staffs',
      img: 'assets/img/staff-directory.png',
      role: Role.Student | Role.Lecturer | Role.Admin,
      tags: ['lecturer', 'academic', 'teacher']
    },
    {
      title: 'Track Student Visa Status',
      group: 'Others',
      url: 'visa-status',
      img: 'assets/img/visa-status.png',
      role: Role.Admin,
      tags: ['visa']
    },
    {
      title: 'Upcoming Graduation',
      group: 'Others',
      url: 'https://graduation.sites.apiit.edu.my/',
      img: 'assets/img/upcoming-graduations.png',
      role: Role.Student,
      tags: ['graduation', 'cermony']
    },
    {
      title: 'Feedback',
      group: 'App Related',
      url: 'feedback',
      img: 'assets/img/feedback.png',
      role: Role.Student | Role.Lecturer | Role.Admin,
      tags: []
    },
    {
      title: 'Notification',
      group: 'App Related',
      url: 'notifications',
      img: 'assets/img/notifications.png',
      role: Role.Student | Role.Lecturer | Role.Admin,
      tags: ['messages']
    },
    {
      title: 'Settings',
      group: 'App Related',
      url: 'settings',
      img: 'assets/img/settings.png',
      role: Role.Student | Role.Lecturer | Role.Admin,
      tags: []
    },
    {
      title: 'Logout',
      group: 'App Related',
      url: 'logout',
      img: 'assets/img/logout.png',
      role: Role.Student | Role.Lecturer | Role.Admin,
      tags: ['exit', 'log out', 'log-out']
    },
  ];
  /* tslint:enable:no-bitwise */

  constructor(
    public navCtrl: NavController,
    public iab: InAppBrowser,
    private cas: CasTicketService,
    private settings: SettingsService,
    private userSettings: UserSettingsService,
    private network: Network,
    private toastCtrl: ToastController
  ) { }

  ngOnInit() {
    this.view$ = this.userSettings.getMenuUI();

    const role = this.settings.get('role');
    // tslint:disable-next-line:no-bitwise
    this.menuFiltered = this.menuFull.filter(menu => menu.role & role);
  }

  /** Open page, manually check for third party pages. */
  openPage(url: string) {
    // external pages does not use relative or absolute link
    if (url.startsWith('http://') || url.startsWith('https://')) {
      // manually exclude office365, and course schedule that do not need service ticket
      if (url.startsWith('https://outlook.office.com')
        || url === 'http://kb.sites.apiit.edu.my/knowledge-base/course-schedule/'
        || url === 'https://graduation.sites.apiit.edu.my/') {
        this.iab.create(url, '_system', 'location=true');
      } else {
        if (this.network.type !== 'none') {
          this.cas.getST(url).subscribe(st => {
            this.iab.create(`${url}?ticket=${st}`, '_system', 'location=true');
          });
        } else {
          this.presentToast('External links cannot be opened in offline mode. Please ensure you have a network connection and try again');
        }

      }
    } else {
      this.navCtrl.navigateForward([url]);
    }
  }

  /** No sorting for KeyValuePipe. */
  noop(): number {
    return 0;
  }

  async presentToast(msg: string) {
    const toast = await this.toastCtrl.create({
      message: msg,
      color: 'danger',
      duration: 6000,
      showCloseButton: true,
      position: 'top'
    });
    toast.present();
  }

}
