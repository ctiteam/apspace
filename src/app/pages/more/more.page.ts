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

  term = '';

  /* tslint:disable:no-bitwise */
  menuFull: MenuGroup[] = [
    {
      title: 'Main',
      items: [
        {
          title: 'Profile',
          url: '',
          size: 'small',
          color: 'purple',
          icon: 'contact',
          role: Role.Student | Role.Lecturer | Role.Admin,
          tags: ['mentor']
        },
        {
          title: 'Fees',
          url: '',
          size: 'small',
          color: 'dark-orange',
          icon: 'cash',
          role: Role.Student,
          tags: []
        },
        {
          title: 'Bus Tracking',
          url: '',
          size: 'medium',
          color: 'orange',
          icon: 'bus',
          role: Role.Student | Role.Lecturer | Role.Admin,
          tags: []
        },
        {
          title: 'Holidays',
          url: '',
          size: 'small',
          color: 'orange',
          icon: 'bicycle',
          role: Role.Student | Role.Lecturer | Role.Admin,
          tags: []
        },
        {
          title: 'News',
          url: '',
          size: 'small',
          color: 'green',
          icon: 'paper',
          role: Role.Student ,
          tags: []
        },
        {
          title: 'Knowledge Base',
          url: 'http://kb.sites.apiit.edu.my/home/',
          size: 'medium',
          color: 'dark-orange',
          icon: 'paper',
          role: Role.Student | Role.Lecturer | Role.Admin,
          tags: []
        },
        {
          title: 'Forms & Application',
          url: 'http://forms.sites.apiit.edu.my/home/',
          size: 'medium',
          color: 'blue',
          icon: 'clipboard',
          role: Role.Student | Role.Lecturer | Role.Admin,
          tags: []
        },
        {
          title: 'APCard',
          url: '',
          size: 'small',
          color: 'red',
          icon: 'card',
          role: Role.Student | Role.Lecturer | Role.Admin,
          tags: []
        },
        {
          title: 'Webmail',
          url: 'https://outlook.office.com/owa/?realm=mail.apu.edu.my',
          size: 'small',
          color: 'purple',
          icon: 'mail',
          role: Role.Student,
          tags: []
        },
        {
          title: 'APLC Progress Report',
          url: '',
          size: 'large',
          color: 'purple',
          icon: 'card',
          role: Role.Lecturer | Role.Admin,
          tags: []
        },
      ],
    },
    {
      title: 'Course Related',
      items: [
        {
          title: 'Results',
          url: '',
          size: 'small',
          color: 'red',
          icon: 'checkbox',
          role: Role.Student,
          tags: []
        },
        {
          title: 'iConsult',
          url: '',
          size: 'small',
          color: 'green',
          icon: 'clipboard',
          role: Role.Lecturer | Role.Admin,
          tags: []
        },
        // {
        //   title: 'Student Consent Form',
        //   url: '',
        //   size: 'large',
        //   color: 'orange',
        //   icon: 'create',
        //   role: Role.Lecturer | Role.Admin,
        //   tags: []
        // },
        {
          title: 'iConsult',
          url: '',
          size: 'medium',
          color: 'green',
          icon: 'clipboard',
          role: Role.Student,
          tags: []
        },
        {
          title: 'Timetable',
          url: '',
          size: 'small',
          color: 'orange',
          icon: 'clipboard',
          role: Role.Student,
          tags: []
        },
        {
          title: 'Exam Schedule',
          url: '',
          size: 'medium',
          color: 'purple',
          icon: 'book',
          role: Role.Student | Role.Lecturer | Role.Admin,
          tags: []
        },
        {
          title: 'My Library',
          url: 'http://opac.apiit.edu.my/cgi-bin/koha/opac-user.pl',
          size: 'medium',
          color: 'blue',
          icon: 'bookmarks',
          role: Role.Student | Role.Lecturer | Role.Admin,
          tags: []
        },
        {
          title: 'Student Timetable',
          url: '/student-timetable',
          size: 'medium',
          color: 'red',
          icon: 'calendar',
          role: Role.Lecturer | Role.Admin,
          tags: []
        },
        {
          title: 'Moodle (Course Material)',
          url: 'https://lms2.apiit.edu.my/login/index.php',
          size: 'large',
          color: 'dark-orange',
          icon: 'open',
          role: Role.Student | Role.Lecturer | Role.Admin,
          tags: []
        },
        {
          title: 'Attendance',
          url: '',
          size: 'small',
          color: 'orange',
          icon: 'alarm',
          role: Role.Student,
          tags: []
        },
        // {
        //   title: 'Student Survey',
        //   url: '',
        //   size: 'medium',
        //   color: 'green',
        //   icon: 'alarm',
        //   role: Role.Student,
        //   tags: []
        // },
      ],
    },
    {
      title: 'Others',
      items: [
        {
          title: 'Upcoming Graduations',
          url: '',
          size: 'xlarge',
          color: ' orange',
          icon: 'school',
          role: Role.Student | Role.Lecturer | Role.Admin,
          tags: []
        },
        {
          title: 'Graduate Verification Service',
          url: '',
          size: 'xlarge',
          color: ' blue',
          icon: 'document',
          role: Role.Student | Role.Lecturer | Role.Admin,
          tags: []
        },
        // {
        //   title: 'Visa Renewal Status',
        //   url: '',
        //   size: 'small',
        //   color: ' red',
        //   icon: 'md-globe',
        //   role: Role.Student,
        //   tags: []
        // },
        {
          title: 'Staff Directory',
          url: '',
          size: 'medium',
          color: 'dark-orange',
          icon: 'people',
          role: Role.Student | Role.Lecturer | Role.Admin,
          tags: ['lecturer', 'academic']
        },
        {
          title: 'Classroom Finder',
          url: '',
          size: 'medium',
          color: 'purple',
          icon: 'search',
          role: Role.Student | Role.Lecturer | Role.Admin,
          tags: []
        },
        {
          title: 'Operation Hours',
          url: '',
          size: 'medium',
          color: 'green',
          icon: 'information-circle',
          role: Role.Student | Role.Lecturer | Role.Admin,
          tags: []
        },
        {
          title: 'Notification',
          url: '',
          size: 'small',
          color: 'orange',
          icon: 'notifications',
          role: Role.Student | Role.Lecturer | Role.Admin,
          tags: []
        },
        {
          title: 'Feedback',
          url: '',
          size: 'small',
          color: 'green',
          icon: 'at',
          role: Role.Student | Role.Lecturer | Role.Admin,
          tags: []
        },
        {
          title: 'Settings',
          url: '',
          icon: 'settings',
          size: 'small',
          color: 'blue',
          role: Role.Student | Role.Lecturer | Role.Admin,
          tags: []
        },
        {
          title: 'Logout',
          url: '',
          icon: 'log-out',
          size: 'large',
          color: 'red',
          role: Role.Student | Role.Lecturer | Role.Admin,
          tags: []
        },
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
