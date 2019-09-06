import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

import { Settings } from '../interfaces';

/**
 * Settings storage with a similar interface to ionic storage with memory cache.
 */
@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  data = {} as Settings;

  private readyPromise: Promise<void>;

  constructor(public storage: Storage) {
    this.readyPromise = this.storage.get('settings').then(data => this.data = data || {});
  }

  /** Return a promise to check if settings provider is initialized. */
  ready(): Promise<void> {
    return this.readyPromise;
  }

  /**
   * Set value in settings.
   *
   * @param key - key stored
   * @param value - value to be set
   */
  set<K extends keyof Settings>(key: K, value: Settings[K]): void {
    if (this.data[key] === value) { return; }
    this.data[key] = value;
    this.storage.set('settings', this.data);
  }

  /**
   * Get value in settings.
   *
   * @param key - key stored
   */
  get<K extends keyof Settings>(key: K): Settings[K] | undefined {
    console.assert(Object.entries(this.data).length !== 0, 'settings not ready');
    return this.data[key];
  }

  /** Clear settings. */
  clear(): void {
    for (const key in this.data) {
      if (this.data.hasOwnProperty(key)) {
        delete this.data[key];
      }
    }
    this.storage.set('settings', this.data);
  }

}
