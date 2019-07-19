import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class UserSettingsService {
  private darkTheme: BehaviorSubject<boolean>;
  private accentColor: BehaviorSubject<string>;

  constructor(
    public http: HttpClient,
    private storage: Storage,
    public statusBar: StatusBar,
  ) {
    this.darkTheme = new BehaviorSubject(false);
    this.accentColor = new BehaviorSubject('blue-accent-color');
  }

  toggleDarkTheme(val: boolean) {
    this.storage.set('dark-theme', val);
    this.darkTheme.next(val);
  }

  darkThemeActivated() {
    return this.darkTheme.asObservable();
  }

  setAccentColor(val: string) {
    this.storage.set('accent-color', val);
    this.accentColor.next(val);
  }

  getAccentColor() {
    return this.accentColor.asObservable();
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
        console.log(value);
        this.toggleDarkTheme(value);
        this.changeStatusBarColor(value);
      } else {
        this.toggleDarkTheme(false);
        this.changeStatusBarColor(false);
      }
    });
    this.storage.get('accent-color').then(value => {
      value
        ? this.setAccentColor(value)
        : this.setAccentColor('blue-accent-color');
    });
  }
}
