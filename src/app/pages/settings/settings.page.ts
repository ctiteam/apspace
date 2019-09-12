import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSelect, ModalController, NavController, ToastController, AlertController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { map, pluck } from 'rxjs/operators';

import { APULocations, APULocation, StudentProfile, Role } from '../../interfaces';
import { SearchModalComponent } from '../../components/search-modal/search-modal.component';
import {
  SettingsService, StudentTimetableService, UserSettingsService, WsApiService
} from '../../services';
// import { toastMessageEnterAnimation } from '../../animations/toast-message-animation/enter';
// import { toastMessageLeaveAnimation } from '../../animations/toast-message-animation/leave';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  userRole = false;
  test = false;
  @ViewChild('dashboardSectionsSelect', { static: true }) dashboardSectionsselectBoxRef: IonSelect;
  activeAccentColor: string;
  darkThemeEnabled = false;
  pureDarkThemeEnabled = false;
  // BUS

  busShuttleServiceSettings = {
    firstLocation: '',
    secondLocation: '',
    alarmBefore: ''
  };

  menuUI: 'cards' | 'list' = 'list';
  dashboardSections;

  locations$: Observable<APULocation[]>;
  timetable$: Observable<{ blacklists: string[] }>;

  allDashboardSections = [
    { section: 'profile', name: 'Profile', disabled: true },
    // { section: 'dashboardAlerts', name: 'Alerts', disabled: false },
    { section: 'quickAccess', name: 'Quick Access', disabled: false },
    { section: 'todaysSchedule', name: 'Today\'s Schedule', disabled: false },
    { section: 'upcomingEvents', name: 'Upcoming Events', disabled: false },
    { section: 'apcard', name: 'APCard', disabled: false },
    { section: 'lowAttendance', name: 'Low Attendance', disabled: false },
    { section: 'financials', name: 'Financials', disabled: false },
    { section: 'cgpa', name: 'CGPA Per Intake', disabled: false },
    { section: 'busShuttleServices', name: 'Today\'s Trips', disabled: false }
  ];
  accentColors = [
    { title: 'Blue (Default)', value: 'blue-accent-color' },
    { title: 'Green', value: 'green-accent-color' },
    { title: 'Red', value: 'red-accent-color' },
    { title: 'Pink', value: 'pink-accent-color' },
    { title: 'Yellow', value: 'yellow-accent-color' }
  ];

  constructor(
    private modalCtrl: ModalController,
    private navCtrl: NavController,
    private settings: SettingsService,
    private toastCtrl: ToastController,
    private tt: StudentTimetableService,
    private userSettings: UserSettingsService,
    private ws: WsApiService,
    private alertCtrl: AlertController,
  ) {
    this.userSettings
      .darkThemeActivated()
      .subscribe(
        {
          next: value => (this.darkThemeEnabled = value)
        }
      );
    this.userSettings
      .PureDarkThemeActivated()
      .subscribe(
        {
          next: value => (this.pureDarkThemeEnabled = value)
        }
      );
    this.userSettings
      .getAccentColor()
      .subscribe(
        {
          next: value => (this.activeAccentColor = value)
        });
    this.userSettings
      .getMenuUI()
      .subscribe(
        {
          next: value => (this.menuUI = value)
        });
    this.userSettings
      .getShownDashboardSections()
      .subscribe(
        {
          next: value => this.dashboardSections = value
        });
    this.userSettings
      .getBusShuttleServiceSettings()
      .subscribe(
        {
          next: value => this.busShuttleServiceSettings = value
        });
    this.timetable$ = this.userSettings.timetable.asObservable();
  }


  ngOnInit() {
    const role = this.settings.get('role');
    // tslint:disable-next-line: no-bitwise
    if (this.settings.get('role') & Role.Student) {
      this.userRole = true;
    }
    this.locations$ = this.getLocations();
  }

  getLocations() {
    return this.ws.get<APULocations>(`/transix/locations`, true, { auth: false }).pipe(
      map((res: APULocations) => res.locations),
    );
  }


  setBusShuttleServicesSettings() {
    this.userSettings.setBusShuttleServicesSettings(this.busShuttleServiceSettings);
  }



  dashboardSectionsChanged() {
    this.userSettings.setShownDashboardSections(this.dashboardSections);
  }

  openDashboardSectionsSelectBox() {
    this.dashboardSectionsselectBoxRef.open();
  }

  toggleDarkTheme() {
    this.pureDarkThemeEnabled = false;
    this.userSettings.toggleDarkTheme(this.darkThemeEnabled);
  }

  togglePureDarkTheme() {
    this.userSettings.togglePureDarkTheme(this.pureDarkThemeEnabled);
    this.pureDarkThemeEnabled
      ? this.userSettings.setAccentColor('white-accent-color')
      : this.userSettings.setAccentColor('blue-accent-color');
  }

  toggleAccentColor() {
    this.userSettings.setAccentColor(this.activeAccentColor);
  }

  toggleMenuUI() {
    this.userSettings.setMenuUI(this.menuUI);
  }

  async timetableModuleBlacklistsAdd() {
    const setting = this.userSettings.timetable.value;
    const timetables = await this.tt.get().toPromise();

    const intakeHistory = this.settings.get('intakeHistory') || [];
    const intake = intakeHistory[intakeHistory.length - 1]
      || await this.ws.get<StudentProfile>('/student/profile').pipe(pluck('INTAKE')).toPromise();

    // ignored those that are blacklisted
    const filtered = timetables.filter(timetable => !setting.blacklists.includes(timetable.MODID));
    const items = [...new Set(filtered.map(timetable => timetable.MODID))];
    const defaultItems = [...new Set(filtered
      .filter(timetable => timetable.INTAKE === intake)
      .map(timetable => timetable.MODID))];
    const placeholder = 'Search all modules';
    const notFound = 'No module selected';
    const modal = await this.modalCtrl.create({
      component: SearchModalComponent,
      componentProps: { items, defaultItems, placeholder, notFound }
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();
    if (data && data.item) {
      setting.blacklists.push(data.item);
      this.userSettings.timetable.next(setting);
    }
  }

  timetableModuleBlacklistsRemove(value) {
    const setting = this.userSettings.timetable.value;
    setting.blacklists.splice(value, 1);
    this.userSettings.timetable.next(setting);
  }

  clearCache() {
    this.userSettings.clearStorage().then(
      () => this.showToastMessage('Cached has been cleared successfully')
    );
  }

  navigateToPage(pageName: string) {
    this.navCtrl.navigateForward(pageName);
  }

  showToastMessage(message: string) {
    this.toastCtrl.create({
      message,
      duration: 6000,
      showCloseButton: true,
      position: 'top',
      animated: true,
      color: 'success',
      // enterAnimation: toastMessageEnterAnimation,
      // leaveAnimation: toastMessageLeaveAnimation
    }).then(toast => toast.present());
  }

  async resetByod() {
    const confirm = await this.alertCtrl.create({
      header: 'BYOD Reset',
      message: 'You are about to send a request to the helpdesk support system to reset your BYOD. Do you want to continue?',
      buttons: [
        {
          text: 'No',
          handler: () => {
          }
        },
        {
          text: 'Yes',
          handler: () => {
            this.ws.get('/byod/reset').subscribe(
              data => {
              },
              err => {
                console.error(err);
              },
              async () => {
                const toast = await this.toastCtrl.create({
                  message: 'Your request has been sent to the helpdesk support system and it is being processed now.',
                  duration: 2000
                });
                await toast.present();
              }
            );
          }
        }
      ]
    });
    await confirm.present();
  }

}
