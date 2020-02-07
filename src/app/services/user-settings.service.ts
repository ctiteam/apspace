import { Injectable } from '@angular/core';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserSettingsService {
  activeAccentColor = 'blue-accent-color';
  private darkTheme: BehaviorSubject<boolean>;
  private pureDarkTheme: BehaviorSubject<boolean>;
  private accentColor: BehaviorSubject<string>;
  private dashboardSections: BehaviorSubject<string[]>;
  private menuUI: BehaviorSubject<'cards' | 'list'>;
  private casheCleaered: BehaviorSubject<boolean>;
  private activeTimeFormat: BehaviorSubject<'24-hours' | '12-hours'>;
  private busShuttleServiceSettings: BehaviorSubject<{ firstLocation: string, secondLocation: string, alarmBefore: string }>;
  timetable: BehaviorSubject<{ blacklists: string[] }>;

  timeFormats = [
    { name: '12-hours', value: '12-hours' },
    { name: '24-hours', value: '24-hours' }
  ];

  accentColors = [
    { name: 'red-accent-color', value: '#e54d42', rgbaValues: '229, 77, 66' },
    { name: 'yellow-accent-color', value: '#DFA847', rgbaValues: '223, 168, 71' },
    { name: 'blue-accent-color', value: '#3A99D9', rgbaValues: '58, 153, 217' },
    { name: 'green-accent-color', value: '#08a14f', rgbaValues: '8, 161, 79' },
    { name: 'red-accent-color', value: '#ec2a4d', rgbaValues: '236, 42, 77' },
    { name: 'white-accent-color', value: '#b0acac', rgbaValues: '175, 175, 175' }
  ];

  // Default dasbhoard sections (will be added when the application loads /app.componenet/)
  defaultDashboardSectionsSettings = [];

  // Default dasbhoard sections for students (will be added to the local storage when student login)
  defaultStudentsDashboardSectionsSettings = [
    'quickAccess',
    'todaysSchedule',
    'upcomingEvents',
    'lowAttendance',
    'upcomingTrips',
    'apcard',
    'cgpa',
    'financials',
    'news',
    'noticeBoard'
  ];

  // Default dasbhoard sections for staff (will be added to the local storage when staff login)
  defaultStaffDashboardSectionsSettings = [
    'inspirationalQuote',
    'todaysSchedule',
    'upcomingEvents',
    'upcomingTrips',
    'apcard',
    'news',
    'noticeBoard'
  ];

  defaultBusShuttleServicesSettings = { firstLocation: '', secondLocation: '', alarmBefore: '10' };

  constructor(
    private storage: Storage,
    public statusBar: StatusBar,
    private platform: Platform
  ) {
    this.darkTheme = new BehaviorSubject(false);
    this.pureDarkTheme = new BehaviorSubject(false);
    this.accentColor = new BehaviorSubject('blue-accent-color');
    this.dashboardSections = new BehaviorSubject(this.defaultDashboardSectionsSettings);
    this.menuUI = new BehaviorSubject('list');
    this.activeTimeFormat = new BehaviorSubject('24-hours');
    this.busShuttleServiceSettings = new BehaviorSubject(this.defaultBusShuttleServicesSettings);
    this.casheCleaered = new BehaviorSubject(false);
    this.timetable = new BehaviorSubject({ blacklists: [] });
  }

  // DARK THEME
  toggleDarkTheme(val: boolean) {
    this.storage.set('dark-theme', val);
    this.darkTheme.next(val);
  }

  darkThemeActivated() {
    return this.darkTheme.asObservable();
  }

  clearStorage() {
    let tgt: string;
    let cred: string;
    let settings: {};
    let dashboardItems = [];
    return this.storage.get('cred').then((credValue) => { // KEEP CRED TO GENERATE TGT WHEN EXPIRED
      cred = credValue;
      this.storage.get('tgt').then((tgtValue) => { // KEEP TGT TO PREVENT BREAKING THE APP
        tgt = tgtValue;
        this.storage.get('settings').then((settingsValue) => {
          settings = settingsValue;
          this.storage.get('dashboard-sections').then(
            dashboardSections => {
              dashboardItems = dashboardSections;
              this.storage.clear().then(() => {
                this.storage.set('tgt', tgt);
                this.storage.set('cred', cred);
                this.storage.set('settings', settings);
                this.storage.set('dashboard-sections', dashboardItems);
              }).then(
                _ => this.casheCleaered.next(true)
              );
            }
          );
        });
      });
    }
    );
  }

  subscribeToCacheClear() {
    return this.casheCleaered.asObservable();
  }

  // BUS SHUTTLE SERVICES
  setBusShuttleServicesSettings(val: { firstLocation: string, secondLocation: string, alarmBefore: string }) {
    this.storage.set('bus-shuttle-services', val);
    this.busShuttleServiceSettings.next(val);
  }

  getBusShuttleServiceSettings() {
    return this.busShuttleServiceSettings.asObservable();
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

  // TIME FORMAT
  setTimeFormat(val: '12-hours' | '24-hours') {
    this.storage.set('time-format', val);
    this.activeTimeFormat.next(val);
  }

  getTimeFormat() {
    return this.activeTimeFormat.asObservable();
  }

  getAccentColorRgbaValue() {
    let value = '';
    this.accentColors.forEach(accentColor => {
      if (accentColor.name === this.accentColor.value) {
        value = accentColor.rgbaValues;
      }
    });
    return value;
  }

  setDefaultDashboardSections(userType: 'students' | 'staff') {
    let value = [];
    if (userType === 'staff') {
      value = this.defaultStaffDashboardSectionsSettings;
    } else {
      value = this.defaultStudentsDashboardSectionsSettings;
    }
    this.storage.set('dashboard-sections', value);
    this.dashboardSections.next(value);
  }



  // DASHBOARD SECTIONS
  setShownDashboardSections(val: string[]) {
    this.storage.set('dashboard-sections', val);
    this.dashboardSections.next(val);
  }

  getShownDashboardSections() {
    return this.dashboardSections.asObservable();
  }

  // MENU UI
  setMenuUI(val: 'cards' | 'list') {
    this.storage.set('menu-ui', val);
    this.menuUI.next(val);
  }

  getMenuUI() {
    return this.menuUI.asObservable();
  }

  changeStatusBarColor(darkThemeSelected: boolean) {
    if (this.platform.is('cordova')) {
      if (darkThemeSelected === false) {
        this.statusBar.backgroundColorByHexString('#e7e7e7');
        this.statusBar.styleDefault();
      } else {
        this.statusBar.backgroundColorByHexString('#1d1b1b');
        this.statusBar.styleLightContent();
      }
    }
  }

  getUserSettingsFromStorage() {
    // GETTING THE USER SETTINGS FROM STORAGE
    // IT IS CALLED ONLY IN APP COMPONENT AND THE VALUE PASSED BACK TO HERE
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
    this.storage.get('time-format').then(value => {
      value
        ? this.setTimeFormat(value)
        : this.setTimeFormat('12-hours');
    });
    this.storage.get('menu-ui').then(value => {
      value
        ? this.setMenuUI(value)
        : this.setMenuUI('list');
    });
    this.storage.get('dashboard-sections').then(value => {
      value
        ? this.setShownDashboardSections(value)
        : this.setShownDashboardSections(this.defaultDashboardSectionsSettings);
    });
    this.storage.get('bus-shuttle-services').then(value => {
      if (value) {
        this.setBusShuttleServicesSettings(value);
      } else {
        this.setBusShuttleServicesSettings(this.defaultBusShuttleServicesSettings);
      }
    });
    this.storage.get('timetable').then((value: { blacklists: [] }) => {
      if (value && value.blacklists.length > 0) {
        this.timetable.next(value || { blacklists: [] });
      }
      this.timetable.subscribe(newValue => this.storage.set('timetable', newValue));
    });
  }

}
