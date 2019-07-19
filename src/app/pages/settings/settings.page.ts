import { Component, OnInit } from '@angular/core';
import { UserSettingsService } from 'src/app/services';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  test = false;

  activeAccentColor: string;
  darkThemeEnabled = false;
  pureDarkThemeEnabled = false;
  accentColors = [
    { title: 'Blue (Default)', value: 'blue-accent-color' },
    { title: 'Green', value: 'green-accent-color' },
    { title: 'Grey', value: 'grey-accent-color' },
    { title: 'Orange', value: 'orange-accent-color' },
    { title: 'Pink', value: 'pink-accent-color' },
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
      .getAccentColor()
      .subscribe(
        {
          next: value => (this.activeAccentColor = value)
        });
  }

  ngOnInit() {
  }

  toggleDarkTheme() {
    console.log('dark theme activated: ' + this.darkThemeEnabled);
    this.userSettings.toggleDarkTheme(this.darkThemeEnabled);
  }

  toggleAccentColor() {
    this.userSettings.setAccentColor(this.activeAccentColor);
  }

}
