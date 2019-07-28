import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { DashboardSection } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class UserSettingsService {
  activeAccentColor = 'blue-accent-color';
  private darkTheme: BehaviorSubject<boolean>;
  private pureDarkTheme: BehaviorSubject<boolean>;
  private accentColor: BehaviorSubject<string>;
  private dashboardSections: BehaviorSubject<string[]>;

  accentColors = [
    { name: 'red-accent-color', value: '#e54d42' },
    { name: 'yellow-accent-color', value: '#DFA847' },
    { name: 'blue-accent-color', value: '#3A99D9' },
    { name: 'green-accent-color', value: '#08a14f' },
    { name: 'red-accent-color', value: '#ec2a4d' },
    { name: 'white-accent-color', value: '#FFFFFF'}
  ];

  defaultDashboardSectionsSettings = [
    'profile',
    'dashboardAlerts',
    'quickAccess',
    'todaysSchedule',
    'upcomingEvents',
    'apcard',
    'cgpa',
    'lowAttendance',
    'financials',
  ];

  constructor(
    public http: HttpClient,
    private storage: Storage,
    public statusBar: StatusBar,
  ) {
    this.darkTheme = new BehaviorSubject(false);
    this.pureDarkTheme = new BehaviorSubject(false);
    this.accentColor = new BehaviorSubject('blue-accent-color');
    this.dashboardSections = new BehaviorSubject(this.defaultDashboardSectionsSettings);
  }

  // DARK THEME
  toggleDarkTheme(val: boolean) {
    this.storage.set('dark-theme', val);
    this.darkTheme.next(val);
  }

  darkThemeActivated() {
    return this.darkTheme.asObservable();
  }

  clearStorage() { // TO BE MOVED
    let tgt: string;
    this.storage.get('tgt').then((value) => {
      tgt = value; // WE MIGHT NEED TO ADD CRED ALSO
      this.storage.clear().then(() => {
        console.log('all keys cleared');
        this.storage.set('tgt', tgt);
      });
    }
    );
  }

  // PURE DARK THEME
  togglePureDarkTheme(val: boolean) {
    this.storage.set('pure-dark-theme', val);
    this.pureDarkTheme.next(val);
  }

  PureDarkThemeActivated() {
    return this.pureDarkTheme.asObservable();
  }

  // ACCENT COLORS
  getAccentColor() {
    return this.accentColor.asObservable();
  }

  setAccentColor(val: string) {
    this.storage.set('accent-color', val);
    this.accentColor.next(val);
  }

  getAccentColorValue() {
    let value = '';
    this.accentColors.forEach(accentColor => {
      if (accentColor.name === this.accentColor.value) {
        value = accentColor.value;
      }
    });
    return value;
  }


  // DASHBOARD ALERTS
  setShownDashboardSections(val: string[]) {
    this.storage.set('dashboard-sections', val);
    this.dashboardSections.next(val);
  }

  getShownDashboardSections() {
    return this.dashboardSections.asObservable();
  }

  changeStatusBarColor(darkThemeSelected: boolean) {
    if (darkThemeSelected === false) {
      this.statusBar.backgroundColorByHexString('#e7e7e7');
      this.statusBar.styleDefault();
    } else {
      this.statusBar.backgroundColorByHexString('#1d1b1b');
      this.statusBar.styleLightContent();
    }
  }

  getUserSettingsFromStorage() {
    // GETTING THE USER SETTINGS FROM STORAGE (THEME + ACCENT COLOR)
    // IT IS CALLED ONLY HERE AND THE VALUE PASSED TO THE USER SETTINGS PROVIDER
    // BY DEFAULT THE LIGHT THEME WILL BE APPLIED
    this.storage.get('dark-theme').then(value => {
      if (value) {
        this.toggleDarkTheme(value);
        this.changeStatusBarColor(value);
      } else {
        this.toggleDarkTheme(false);
        this.changeStatusBarColor(false);
      }
    });
    this.storage.get('pure-dark-theme').then(value => {
      if (value) {
        this.togglePureDarkTheme(value);
      } else {
        this.togglePureDarkTheme(false);
      }
    });
    this.storage.get('accent-color').then(value => {
      value
        ? this.setAccentColor(value)
        : this.setAccentColor('blue-accent-color');
    });
    this.storage.get('dashboard-sections').then(value => {
      value
        ? this.setShownDashboardSections(value)
        : this.setShownDashboardSections(this.defaultDashboardSectionsSettings);
    });
  }
}
