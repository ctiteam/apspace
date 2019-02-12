import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';

import { Observable } from 'rxjs/Observable';

import { FeedbackData } from '../interfaces';
import { WsApiProvider } from './ws-api';

declare var detectBrowser;

@Injectable()
export class FeedbackProvider {

  constructor(private plt: Platform, private ws: WsApiProvider) { }

  /**
   * POST: Send feedback to endpoint, long timeout as gravity forms is slow.
   *
   * @param data Feedback data
   */
  sendFeedback(body: FeedbackData): Observable<any> {
    return this.ws.post('/apspacefeedback/submit', { body, timeout: 30000 });
  }

  platform(): string {
    let platform: string;

    if (this.plt.platforms().find(ele => ele === 'core')) {
      platform = detectBrowser();
    } else if (this.plt.platforms().find(ele => ele === 'android')) {
      platform = 'Android';
    } else if (this.plt.platforms().find(ele => ele === 'ios')) {
      platform = 'iOS';
    } else if (this.plt.platforms().find(ele => ele === 'windows')) {
      platform = 'Window Mobile';
    } else {
      platform = this.plt.platforms().toString();
    }

    const versions = this.plt.versions();
    const osVersion = Object.keys(versions).find(p => Boolean(versions[p]));
    const userAgent = navigator.userAgent;

    return [platform, osVersion, userAgent].filter(i => i).join(' ');
  }

}
