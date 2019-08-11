import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { Observable } from 'rxjs';

import { CasTicketService, UserSettingsService } from '../../services';
import { Role } from '../../interfaces';

import { MenuItem } from './menu.interface';

@Component({
  selector: 'app-more',
  templateUrl: './more.page.html',
  styleUrls: ['./more.page.scss'],
})
export class MorePage implements OnInit {
  view$: Observable<'list' | 'cards'>;
  term = '';

  /* tslint:disable:no-bitwise */
  menuFull: MenuItem[] = [
    {
      title: 'Profile',
      group: 'Main',
      url: 'profile',
      img: 'assets/img/profile.png',
      role: Role.Student | Role.Lecturer | Role.Admin,
      tags: ['mentor']
    },
    {
      title: 'Fees',
      group: 'Main',
      url: 'fees',
      img: 'assets/img/fees.svg',
      role: Role.Student,
      tags: []
    },
    {
      title: 'Bus Shuttle Services',
      group: 'Main',
      url: 'bus-shuttle-services',
      img: 'assets/img/bus-shuttle-services.png',
      role: Role.Student | Role.Lecturer | Role.Admin,
      tags: []
    },
    {
      title: 'Holidays',
      group: 'Main',
      url: 'holidays',
      img: 'assets/img/holidays.svg',
      role: Role.Student | Role.Lecturer | Role.Admin,
      tags: []
    },
    {
      title: 'News',
      group: 'Main',
      url: 'news',
      img: 'assets/img/news.png',
      role: Role.Student ,
      tags: []
    },
    {
      title: 'Knowledge Base',
      group: 'Main',
      url: 'http://kb.sites.apiit.edu.my/home/',
      img: 'assets/img/kb.png',
      role: Role.Student | Role.Lecturer | Role.Admin,
      tags: []
    },
    {
      title: 'Forms & Application',
      group: 'Main',
      url: 'http://forms.sites.apiit.edu.my/home/',
      img: 'assets/img/forms-and-applications.png',
      role: Role.Student | Role.Lecturer | Role.Admin,
      tags: []
    },
    {
      title: 'APCard',
      group: 'Main',
      url: 'apcard',
      img: 'assets/img/apcard.png',
      role: Role.Student | Role.Lecturer | Role.Admin,
      tags: []
    },
    {
      title: 'Webmail',
      group: 'Main',
      img: 'assets/img/webmail.png',
      url: 'https://outlook.office.com/owa/?realm=mail.apu.edu.my',
      role: Role.Student,
      tags: []
    },
    // {
    //   title: 'APLC Progress Report',
    //   group: 'Main',
    //   url: '',
    //   img: 'assets/img/aplc-progress-report.png',
    //   role: Role.Lecturer | Role.Admin,
    //   tags: []
    // },
    // {
    //   title: 'Results',
    //   group: 'Course Related',
    //   url: '',
    //   img: 'assets/img/results.png',
    //   role: Role.Student,
    //   tags: []
    // },
    // {
    //   title: 'iConsult',
    //   group: 'Course Related',
    //   img: 'assets/img/iconsult.png',
    //   url: '',
    //   role: Role.Lecturer | Role.Admin,
    //   tags: []
    // },
    // {
    //   title: 'Student Consent Form',
    //   group: 'Course Related',
    //   url: '',
    //   role: Role.Lecturer | Role.Admin,
    //   tags: []
    // },
    // {
    //   title: 'iConsult',
    //   group: 'Course Related',
    //   url: '',
    //   img: 'assets/img/iconsult.png',
    //   role: Role.Student,
    //   tags: []
    // },
    {
      title: 'Timetable',
      group: 'Course Related',
      url: 'student-timetable',
      img: 'assets/img/timetable.png',
      role: Role.Student,
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
      title: 'My Library',
      group: 'Course Related',
      url: 'http://opac.apiit.edu.my/cgi-bin/koha/opac-user.pl',
      img: 'assets/img/my-library.png',
      role: Role.Student | Role.Lecturer | Role.Admin,
      tags: []
    },
    {
      title: 'Student Timetable',
      group: 'Course Related',
      url: 'student-timetable',
      img: 'assets/img/timetable.png',
      role: Role.Lecturer | Role.Admin,
      tags: []
    },
    {
      title: 'Moodle (Course Material)',
      group: 'Course Related',
      url: 'https://lms2.apiit.edu.my/login/index.php',
      img: 'assets/img/moodle.png',
      role: Role.Student | Role.Lecturer | Role.Admin,
      tags: []
    },
    {
      title: 'Attendance',
      group: 'Course Related',
      url: 'attendance',
      img: 'assets/img/attendance.png',
      role: Role.Student,
      tags: []
    },
    // {
    //   title: 'Student Survey',
    //   group: 'Course Related',
    //   url: '',
    //   role: Role.Student,
    //   tags: []
    // },
    // {
    //   title: 'Upcoming Graduations',
    //  group: 'Others',
    //   url: '',
    //   img: 'assets/img/upcoming-graduations.png',
    //   role: Role.Student | Role.Lecturer | Role.Admin,
    //   tags: []
    // },
    {
      title: 'Graduate Verification Service',
      group: 'Others',
      url: 'graduate-verification-service',
      img: 'assets/img/graduate-verification-service.png',
      role: Role.Student | Role.Lecturer | Role.Admin,
      tags: []
    },
    // {
    //   title: 'Visa Renewal Status',
    //   group: 'Others',
    //   url: '',
    //   role: Role.Student,
    //   tags: []
    // },
    {
      title: 'Staff Directory',
      group: 'Others',
      url: 'staffs',
      img: 'assets/img/staff-directory.png',
      role: Role.Student | Role.Lecturer | Role.Admin,
      tags: ['lecturer', 'academic']
    },
    {
      title: 'Classroom Finder',
      group: 'Others',
      url: 'classroom-finder',
      img: 'assets/img/classroom-finder.png',
      role: Role.Student | Role.Lecturer | Role.Admin,
      tags: []
    },
    // {
    //   title: 'Operation Hours',
    //   group: 'Others',
    //   url: '',
    //   img: 'assets/img/operation-hours.png',
    //   role: Role.Student | Role.Lecturer | Role.Admin,
    //   tags: []
    // },
    {
      title: 'Notification',
      group: 'Others',
      url: 'notifications',
      img: 'assets/img/notifications.png',
      role: Role.Student | Role.Lecturer | Role.Admin,
      tags: []
    },
    {
      title: 'Feedback',
      group: 'Others',
      url: 'feedback',
      img: 'assets/img/feedback.png',
      role: Role.Student | Role.Lecturer | Role.Admin,
      tags: []
    },
    {
      title: 'Settings',
      group: 'Others',
      url: 'settings',
      img: 'assets/img/settings.png',
      role: Role.Student | Role.Lecturer | Role.Admin,
      tags: []
    },
    // {
    //   title: 'Logout',
    //   url: 'logout',
    //   img: 'assets/img/logout.png',
    //   role: Role.Student | Role.Lecturer | Role.Admin,
    //   tags: []
    // },
  ];
  /* tslint:enable:no-bitwise */

  constructor(
    public router: Router,
    public iab: InAppBrowser,
    private cas: CasTicketService,
    private userSettings: UserSettingsService
  ) { }

  ngOnInit() {
    this.view$ = this.userSettings.getMenuUI();
  }

  /** Open page, manually check for third party pages. */
  openPage(url: string) {
    // external pages does not use relative or absolute link
    if (url.startsWith('http://') || url.startsWith('https://')) {
      // manually exclude office365 that does not need service ticket
      if (url.startsWith('https://outlook.office.com')) {
        this.iab.create(url, '_blank', 'location=true');
      } else {
        this.cas.getST(url).subscribe(st => {
          this.iab.create(`${url}?ticket=${st}`, '_blank', 'location=true');
        });
      }
    } else {
      this.router.navigate([url]);
    }
  }

  /** No sorting for KeyValuePipe. */
  noop(a: MenuItem, b: MenuItem): number {
    return 0;
  }

}
