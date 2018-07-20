import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

import { Settings } from '../interfaces';

/**
 * Settings storage with a similar interface to ionic storage with memory cache.
 */
@Injectable()
export class SettingsProvider {

  data: Settings;

  constructor(public storage: Storage) {
    this.storage.get('settings').then(data => this.data = data || {});
  }

  /**
   * Set value in settings.
   *
   * @param key - key stored
   * @param value - value to be set
   */
  set(key: keyof Settings, value: any): void {
    if (this.data[key] === value) return;
    this.data[key] = value;
    this.storage.set('settings', this.data);
  }

  /**
   * Get value in settings.
   *
   * @param key - key stored
   */
  get<K extends keyof Settings>(key: K): Settings[K] {
    return this.data[key];
  }

  /** Clear settings. */
  clear(): void {
    for (let key in this.data) {
      delete this.data[key];
    }
  }

}
