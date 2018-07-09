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
  set(key: keyof Settings, value: any): void {
    this.data[key] = value;
    this.storage.set('settings', this.data);
  }

  get<K extends keyof Settings>(key: K): Settings[K] {
    return this.data[key];
  }
}
