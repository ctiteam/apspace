import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { BehaviorSubject } from 'rxjs/Rx';

@Injectable()
export class UserSettingsProvider {
  private theme: BehaviorSubject<string>;
  private colorScheme: BehaviorSubject<string>;

  constructor(
    public http: HttpClient,
    private storage: Storage,
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

  getUserSettingsFromStorage() {
    // GETTING THE USER SETTINGS FROM STORAGE (THEME + COLOR SCHEME)
    // IT IS CALLED ONLY HERE AND THE VALUE PASSED TO THE USER SETTINGS PROVIDER
    // BY DEFAULT THE LIGHT THEME WILL BE APPLIED
    this.storage.get('theme').then(value => {
      value
        ? this.setActiveTheme(value)
        : this.setActiveTheme('light-theme');
    });
    this.storage.get('colorScheme').then(value => {
      value
        ? this.setColorScheme(value)
        : this.setColorScheme('blue-color-scheme');
    });
  }
}
