import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { BehaviorSubject } from 'rxjs/Rx';
import { StatusBar } from '@ionic-native/status-bar';

@Injectable()
export class UserSettingsProvider {
  private theme: BehaviorSubject<string>;
  private colorScheme: BehaviorSubject<string>;

  constructor(
    public http: HttpClient,
    private storage: Storage,
    public statusBar: StatusBar,
  ) {
    this.theme = new BehaviorSubject('light-theme');
    this.colorScheme = new BehaviorSubject('blue-color');
  }

  setActiveTheme(val: string) {
    this.storage.set('theme', val);
    this.theme.next(val);
  }

  getActiveTheme() {
    return this.theme.asObservable();
  }

  setColorScheme(val: string) {
    this.storage.set('colorScheme', val);
    this.colorScheme.next(val);
  }

  getColorScheme() {
    return this.colorScheme.asObservable();
  }

  changeStatusBarColor(selectedTheme: string){
    if(selectedTheme === 'light-theme'){
      this.statusBar.backgroundColorByHexString('#e7e7e7');
      this.statusBar.styleDefault();
    } else if (selectedTheme === 'dark-theme'){
      this.statusBar.backgroundColorByHexString('#1d1b1b');
      this.statusBar.styleLightContent();
    }
  }

  getUserSettingsFromStorage() {
    // GETTING THE USER SETTINGS FROM STORAGE (THEME + COLOR SCHEME)
    // IT IS CALLED ONLY HERE AND THE VALUE PASSED TO THE USER SETTINGS PROVIDER
    // BY DEFAULT THE LIGHT THEME WILL BE APPLIED
    this.storage.get('theme').then(value => {
      value
        if (value){
          console.log(value);
          this.setActiveTheme(value);
          this.changeStatusBarColor(value);
        } else {
          this.setActiveTheme('light-theme');
          this.changeStatusBarColor('#e7e7e7');
        }
    });
    this.storage.get('colorScheme').then(value => {
      value
        ? this.setColorScheme(value)
        : this.setColorScheme('blue-color-scheme');
    });
  }
}
