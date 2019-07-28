import { Component, OnInit, ViewChild } from '@angular/core';
import { UserSettingsService } from 'src/app/services';
import { IonSelect } from '@ionic/angular';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  test = false;
  @ViewChild('dashboardSectionsSelect') dashboardSectionsselectBoxRef: IonSelect;
  activeAccentColor: string;
  darkThemeEnabled = false;
  pureDarkThemeEnabled = false;
  dashboardSections;

  allDashboardSections = [
    { section: 'profile', name: 'Profile' },
    { section: 'dashboardAlerts', name: 'Alerts' },
    { section: 'quickAccess', name: 'Quick Access' },
    { section: 'todaysSchedule', name: 'Todays Schedule' },
    { section: 'upcomingEvents', name: 'Upcoming Events' },
    { section: 'apcard', name: 'APCard' },
    { section: 'lowAttendance', name: 'Low Attendance' },
    { section: 'financials', name: 'Financials' },
    { section: 'cgpa', name: 'CGPA Per Intake' }
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
      .getShownDashboardSections()
      .subscribe(
        {
          next: value => this.dashboardSections = value
        });
  }

  dashboardSectionsChanged() {
    this.userSettings.setShownDashboardSections(this.dashboardSections);
  }

  ngOnInit() {
  }

  openDashboardSectionsSelectBox() {
    this.dashboardSectionsselectBoxRef.open();
  }

  toggleDarkTheme() {
    this.pureDarkThemeEnabled = false;
    this.userSettings.toggleDarkTheme(this.darkThemeEnabled);
    this.togglePureDarkTheme();
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
  toggleDashboardAlerts() {
    // this.userSettings.setShowDashboardAlerts(this.showDashboardAlerts);
  }
}
