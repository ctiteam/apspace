import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { animate, keyframes, style, transition, trigger } from '@angular/animations';

import { SettingsService } from '../../services';
import { Role } from '../../interfaces';
import { TabItem } from './tab-item.interface';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
  animations: [
    trigger('swing_me', [
      transition('false => true', [
        style({
          'transform-origin': 'top center',
          'animation-fill-mode': 'both'
        }),
        animate('1s', keyframes([
          style({ transform: 'rotate3d(0, 0, 1, 15deg)', offset: 0.2 }),
          style({ transform: 'rotate3d(0, 0, 1, -10deg)', offset: 0.4 }),
          style({ transform: 'rotate3d(0, 0, 1, 5deg)', offset: 0.6 }),
          style({ transform: 'rotate3d(0, 0, 1, -5deg)', offset: 0.8 }),
          style({ transform: 'rotate3d(0, 0, 1, 0deg)', offset: 1 }),
        ]))
      ])
    ])
  ]
})
export class TabsPage implements OnInit {
  selectedTab: string;
  tabs: TabItem[];

  constructor(private router: Router, private settings: SettingsService) { }

  ngOnInit() {
    this.selectedTab = this.router.url.split('/').pop();

    // tslint:disable:no-bitwise
    // no tabs selected
    if (this.selectedTab === 'tabs') {
      if (this.settings.get('role') & Role.Student) {
        this.router.navigate(['tabs', 'student-dashboard'], { replaceUrl: true });
      } else {
        this.router.navigate(['tabs', 'profile'], { replaceUrl: true });
      }
    }

    if (this.settings.get('role') & Role.Student) {
      this.tabs = [
        {
          name: 'Timetable',
          path: 'student-timetable',
          icon: 'calendar'
        },
        {
          name: 'Attendance',
          path: 'attendance',
          icon: 'alarm'
        },
        {
          name: 'Dashboard',
          path: 'student-dashboard',
          icon: 'pulse'
        },
        {
          name: 'APCard',
          path: 'apcard',
          icon: 'card'
        },
        {
          name: 'More',
          path: 'more',
          icon: 'more'
        }
      ];
    } else if (this.settings.get('role') & Role.Lecturer) {
      this.tabs = [
        {
          name: 'Timetable',
          path: 'lecturer-timetable',
          icon: 'calendar'
        },
        {
          name: 'Bus Shuttle Services',
          path: 'bus-shuttle-services',
          icon: 'bus'
        },
        {
          name: 'Profile',
          path: 'profile',
          icon: 'person'
        },
        {
          name: 'APCard',
          path: 'apcard',
          icon: 'card'
        },
        {
          name: 'More',
          path: 'more',
          icon: 'more'
        }
      ];
    } else if (this.settings.get('role') & Role.Admin) {
      this.tabs = [
        {
          name: 'Profile',
          path: 'profile',
          icon: 'person'
        },
        {
          name: 'APCard',
          path: 'apcard',
          icon: 'card'
        },
        {
          name: 'More',
          path: 'more',
          icon: 'more'
        }
      ];
    } else {
      console.error('Not a valid role');
    }
    // tslint:enable:no-bitwise
  }

}
