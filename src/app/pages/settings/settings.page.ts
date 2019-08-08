import { Component, OnInit, ViewChild } from '@angular/core';
import { UserSettingsService } from 'src/app/services';
import { IonSelect, NavController, ToastController } from '@ionic/angular';
import { toastMessageEnterAnimation } from 'src/app/animations/toast-message-animation/enter';
import { toastMessageLeaveAnimation } from 'src/app/animations/toast-message-animation/leave';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  test = false;
  @ViewChild('dashboardSectionsSelect', { static: true }) dashboardSectionsselectBoxRef: IonSelect;
  activeAccentColor: string;
  darkThemeEnabled = false;
  pureDarkThemeEnabled = false;
  menuUI: 'cards' | 'list' = 'list';
  dashboardSections;

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
    private userSettings: UserSettingsService,
    private navCtrl: NavController,
    private toastCtrl: ToastController,
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
  }


  ngOnInit() {
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
      enterAnimation: toastMessageEnterAnimation,
      leaveAnimation: toastMessageLeaveAnimation
    }).then(toast => toast.present());
  }
}
