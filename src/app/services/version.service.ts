import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class VersionService {
  // TODO: refactor the service to be used for getting all application data (version, platform, screen size...)
  constructor(
    private plt: Platform,
  ) { }

  readonly version = '2.1.7';

  /** Application version name. */
  get name(): string {
    return this.version;
  }

  /** Platform name */
  get platform(): string {
    if (this.plt.platforms().find(ele => ele === 'core')) {
      return 'browser';
    } else if (this.plt.platforms().find(ele => ele === 'android')) {
      return 'Android';
    } else if (this.plt.platforms().find(ele => ele === 'ios')) {
      return 'iOS';
    } else if (this.plt.platforms().find(ele => ele === 'windows')) {
      return 'Window Mobile';
    } else {
      return this.plt.platforms().toString();
    }
  }
}
