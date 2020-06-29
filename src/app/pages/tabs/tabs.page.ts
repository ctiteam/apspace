import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Role } from '../../interfaces';
import { SettingsService } from '../../services';
import { TabItem } from './tab-item.interface';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss']
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
      this.router.navigate(['tabs', 'dashboard'], { replaceUrl: true });
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
          path: 'dashboard',
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
          icon: 'ellipsis-vertical'
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
          name: 'Profile',
          path: 'profile',
          icon: 'person'
        },
        {
          name: 'Dashboard',
          path: 'dashboard',
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
          icon: 'ellipsis-vertical'
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
          name: 'Dashboard',
          path: 'dashboard',
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
          icon: 'ellipsis-vertical'
        }
      ];
    } else {
      console.error('Invalid role');
    }
    // tslint:enable:no-bitwise
  }

}
