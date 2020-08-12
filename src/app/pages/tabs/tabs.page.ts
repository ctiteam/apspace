import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';

import { Role } from '../../interfaces';
import { TabItem } from './tab-item.interface';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss']
})
export class TabsPage implements OnInit {
  selectedTab: string;
  tabs: TabItem[];
  bottomTabs = false;

  constructor(private router: Router, private storage: Storage) { }

  ngOnInit() {
    this.onResize();
    this.selectedTab = this.router.url.split('/').pop();

    if (this.selectedTab === 'tabs') {
      this.router.navigate(['tabs', 'dashboard'], { replaceUrl: true });
    }

    this.storage.get('role').then((role: Role) => {
      // tslint:disable:no-bitwise
      if (role & Role.Student) {
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
      } else if (role & Role.Lecturer) {
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
      } else if (role & Role.Admin) {
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
    });
    // tslint:enable:no-bitwise
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.bottomTabs = window.innerWidth <= 720;
  }

}
