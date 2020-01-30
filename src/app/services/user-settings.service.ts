import { Injectable } from '@angular/core';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { BehaviorSubject } from 'rxjs';
import { skip } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserSettingsService {
  private dashboardSections: BehaviorSubject<string[]>;
  private menuUI: BehaviorSubject<'cards' | 'list'>;
  private casheCleaered: BehaviorSubject<boolean>;
  private busShuttleServiceSettings: BehaviorSubject<{ firstLocation: string, secondLocation: string, alarmBefore: string }>;

  timetable = new BehaviorSubject({ blacklists: [] as string[] });
  theme = new BehaviorSubject('');
  accentColor = new BehaviorSubject('blue-accent-color');

  readonly accentColors = [
    { title: 'Sky (Default)', name: 'blue-accent-color', value: '#3a99d9', rgbaValues: '58, 153, 217' },
    { title: 'Forest', name: 'green-accent-color', value: '#08a14f', rgbaValues: '8, 161, 79' },
    { title: 'Fire', name: 'red-accent-color', value: '#e54d42', rgbaValues: '229, 77, 66' },
    { title: 'Flower', name: 'pink-accent-color', value: '#ec2a4d', rgbaValues: '236, 42, 77' },
    { title: 'Lightning', name: 'yellow-accent-color', value: '#dfa847', rgbaValues: '223, 168, 71' },
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
    this.dashboardSections = new BehaviorSubject(this.defaultDashboardSectionsSettings);
    this.menuUI = new BehaviorSubject('list');
    this.busShuttleServiceSettings = new BehaviorSubject(this.defaultBusShuttleServicesSettings);
    this.casheCleaered = new BehaviorSubject(false);
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

  getAccentColorRgbaValue(): string {
    const accentColor = this.accentColors.find(ac => ac.name === this.accentColor.value);
    return accentColor ? accentColor.rgbaValues : '';
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
    this.track(this.theme, 'theme', newValue => this.changeStatusBarColor(newValue.includes('dark')));
    this.track(this.accentColor, 'accent-color');
    this.track(this.timetable, 'timetable');
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
  }

  /**
   * Helper to keep track of values in user settings.
   *
   * @param subject reference to behavior subject stored
   * @param key storage key
   * @param handler callback when value changed
   */
  private track<T>(subject: BehaviorSubject<T>, key: string, handler: (newValue: T) => void = () => {}) {
    this.storage.get(key).then(value => {
      subject.next(value || subject.value);
      subject.pipe(skip(1)).subscribe(newValue => {
        this.storage.set(key, newValue);
        handler(newValue);
      });
    });
  }

}
