import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

import { CasTicketService } from '../../services';
import { Role } from '../../interfaces';

import { MenuItem, MenuGroup } from './menu.interface';

@Component({
  selector: 'app-more',
  templateUrl: './more.page.html',
  styleUrls: ['./more.page.scss'],
})
export class MorePage {
  menuUI: 'lists' | 'cards' = 'cards';
  term = '';

  /* tslint:disable:no-bitwise */
  menuFull: MenuGroup[] = [
    {
      title: 'Main',
      items: [
        // {
        //   title: 'Profile',
        //   url: 'profile',
        //   img: 'assets/img/profile.png',
        //   role: Role.Student | Role.Lecturer | Role.Admin,
        //   tags: ['mentor']
        // },
        {
          title: 'Fees',
          url: '/fees',
          img: 'assets/img/fees.svg',
          role: Role.Student,
          tags: []
        },
        {
          title: 'Bus Shuttle Services',
          url: 'bus-shuttle-services',
          img: 'assets/img/bus-shuttle-services.png',
          role: Role.Student | Role.Lecturer | Role.Admin,
          tags: []
        },
        {
          title: 'Holidays',
          url: 'holidays',
          img: 'assets/img/holidays.svg',
          role: Role.Student | Role.Lecturer | Role.Admin,
          tags: []
        },
        {
          title: 'News',
          url: 'news',
          img: 'assets/img/news.png',
          role: Role.Student ,
          tags: []
        },
        {
          title: 'Knowledge Base',
          url: 'http://kb.sites.apiit.edu.my/home/',
          img: 'assets/img/kb.png',
          role: Role.Student | Role.Lecturer | Role.Admin,
          tags: []
        },
        {
          title: 'Forms & Application',
          url: 'http://forms.sites.apiit.edu.my/home/',
          img: 'assets/img/forms-and-applications.png',
          role: Role.Student | Role.Lecturer | Role.Admin,
          tags: []
        },
        {
          title: 'APCard',
          url: 'apcard',
          img: 'assets/img/apcard.png',
          role: Role.Student | Role.Lecturer | Role.Admin,
          tags: []
        },
        {
          title: 'Webmail',
          img: 'assets/img/webmail.png',
          url: 'https://outlook.office.com/owa/?realm=mail.apu.edu.my',
          role: Role.Student,
          tags: []
        },
        // {
        //   title: 'APLC Progress Report',
        //   url: '',
        //   img: 'assets/img/aplc-progress-report.png',
        //   role: Role.Lecturer | Role.Admin,
        //   tags: []
        // },
      ],
    },
    {
      title: 'Course Related',
      items: [
        // {
        //   title: 'Results',
        //   url: '',
        //   img: 'assets/img/results.png',
        //   role: Role.Student,
        //   tags: []
        // },
        // {
        //   title: 'iConsult',
        //   img: 'assets/img/iconsult.png',
        //   url: '',
        //   role: Role.Lecturer | Role.Admin,
        //   tags: []
        // },
        // {
        //   title: 'Student Consent Form',
        //   url: '',
        //   role: Role.Lecturer | Role.Admin,
        //   tags: []
        // },
        // {
        //   title: 'iConsult',
        //   url: '',
        //   img: 'assets/img/iconsult.png',
        //   role: Role.Student,
        //   tags: []
        // },
        {
          title: 'Timetable',
          url: 'student-timetable',
          img: 'assets/img/timetable.png',
          role: Role.Student,
          tags: []
        },
        {
          title: 'Exam Schedule',
          url: 'exam-schedule',
          img: 'assets/img/exam-schedule.png',
          role: Role.Student | Role.Lecturer | Role.Admin,
          tags: []
        },
        {
          title: 'My Library',
          url: 'http://opac.apiit.edu.my/cgi-bin/koha/opac-user.pl',
          img: 'assets/img/my-library.png',
          role: Role.Student | Role.Lecturer | Role.Admin,
          tags: []
        },
        {
          title: 'Student Timetable',
          url: 'student-timetable',
          img: 'assets/img/timetable.png',
          role: Role.Lecturer | Role.Admin,
          tags: []
        },
        {
          title: 'Moodle (Course Material)',
          url: 'https://lms2.apiit.edu.my/login/index.php',
          img: 'assets/img/moodle.png',
          role: Role.Student | Role.Lecturer | Role.Admin,
          tags: []
        },
        {
          title: 'Attendance',
          url: 'attendance',
          img: 'assets/img/attendance.png',
          role: Role.Student,
          tags: []
        },
        // {
        //   title: 'Student Survey',
        //   url: '',
        //   role: Role.Student,
        //   tags: []
        // },
      ],
    },
    {
      title: 'Others',
      items: [
        // {
        //   title: 'Upcoming Graduations',
        //   url: '',
        //   img: 'assets/img/upcoming-graduations.png',
        //   role: Role.Student | Role.Lecturer | Role.Admin,
        //   tags: []
        // },
        {
          title: 'Graduate Verification Service',
          url: 'graduate-verification-service',
          img: 'assets/img/graduate-verification-service.png',
          role: Role.Student | Role.Lecturer | Role.Admin,
          tags: []
        },
        // {
        //   title: 'Visa Renewal Status',
        //   url: '',
        //   role: Role.Student,
        //   tags: []
        // },
        {
          title: 'Staff Directory',
          url: '',
          img: 'assets/img/staff-directory.png',
          role: Role.Student | Role.Lecturer | Role.Admin,
          tags: ['lecturer', 'academic']
        },
        {
          title: 'Classroom Finder',
          url: 'classroom-finder',
          img: 'assets/img/classroom-finder.png',
          role: Role.Student | Role.Lecturer | Role.Admin,
          tags: []
        },
        // {
        //   title: 'Operation Hours',
        //   url: '',
        //   img: 'assets/img/operation-hours.png',
        //   role: Role.Student | Role.Lecturer | Role.Admin,
        //   tags: []
        // },
        {
          title: 'Notification',
          url: 'notifications',
          img: 'assets/img/notifications.png',
          role: Role.Student | Role.Lecturer | Role.Admin,
          tags: []
        },
        {
          title: 'Feedback',
          url: 'feedback',
          img: 'assets/img/feedback.png',
          role: Role.Student | Role.Lecturer | Role.Admin,
          tags: []
        },
        {
          title: 'Settings',
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
      ],
    },
  ];
  /* tslint:enable:no-bitwise */

  constructor(
    public router: Router,
    public iab: InAppBrowser,
    private cas: CasTicketService,
  ) { }

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

}
