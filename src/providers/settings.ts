import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

import { Settings } from '../interfaces';

@Injectable()
export class SettingsProvider {

  data: Settings;

  defaultData: undefined;

  constructor(public storage: Storage) {
    this.storage.get('settings').then(data => this.data = data || {});
  }

   /**
   *
   * @param key
   * @param value
   */
  set(key: keyof Settings, value: any) {
    this.data[key] = value;
    this.storage.set('settings', this.data);
    console.log(this.data);
  }

  get(key: keyof Settings) {
    return this.data[key];
  }
}
