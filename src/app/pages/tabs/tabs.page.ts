import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { IonSearchbar } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import Fuse from 'fuse.js';

import { Role } from '../../interfaces';
import { menus, menusTitle } from '../more/menu';
import { MenuItem } from '../more/menu.interface';
import { TabItem } from './tab-item.interface';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss']
})
export class TabsPage implements OnInit {
  selectedTab: string;
  tabs: TabItem[];
  smallScreen;
  shownSearchBar = false;

  @ViewChild(IonSearchbar, { static: false }) searchbar: IonSearchbar;

  term = '';
  searching = false; // user focusing on searchbar

  options: Fuse.IFuseOptions<MenuItem> = {
    keys: ['title', 'tags']
  };
  menuFull: MenuItem[] = menus;
  menuFiltered = [] as MenuItem[];
  menusTitle: { [id: string]: string } = menusTitle;

  constructor(private router: Router, private storage: Storage, private iab: InAppBrowser) { }

  ngOnInit() {
    this.selectedTab = this.router.url.split('/').pop();
    if (this.selectedTab === 'tabs') { // TODO do this on routing level instead
      this.router.navigate(['tabs', 'dashboard'], { replaceUrl: true });
    }

    // assert no duplicate id (probably not able to be done during compile time)
    this.menuFull.forEach((menu, _i, arr) => {
      if (arr.find(m => m.id === menu.id) !== menu) {
        console.warn(`duplicate '${menu.id}' in menuFull`);
      }
    });

    this.onResize();

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

      this.storage.get('canAccessResults').then((canAccessResults = false) => {
        this.menuFiltered = this.menuFull.filter(
          // tslint:disable-next-line:no-bitwise
          menu => (menu.role & role) && ((menu.canAccess && menu.canAccess === canAccessResults) || !menu.canAccess)
        );
      });
    });
    // tslint:enable:no-bitwise
  }

  @HostListener('document:keydown.f1')
  @HostListener('document:keydown.?')
  @HostListener('document:keydown.shift.?')
  onKeydownHelp() {
    window.location.href = 'https://apiit.atlassian.net/servicedesk/customer';
  }

  @HostListener('document:keydown.s')
  onKeydownS() {
    // prevent key 's' propagated into search
    setTimeout(() => this.searchbar.setFocus(), 10);
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.smallScreen = window.innerWidth <= 720;
  }

  toggleSearchBar() {
    this.shownSearchBar = !this.shownSearchBar;
  }

  openHelpCentre() {
    this.iab.create('https://apiit.atlassian.net/servicedesk/customer/portals', '_system', 'location=true');
  }

  /** Stop searching after some time, for link clicking time. */
  stopSearching() {
    setTimeout(() => this.searching = false, 100);
  }

  noop(): number {
    return 0;
  }

}
