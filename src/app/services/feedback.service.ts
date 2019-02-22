import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';

import { Observable } from 'rxjs';

import { Feedback } from '../interfaces';
import { WsApiService } from './ws-api.service';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {

  constructor(private plt: Platform, private ws: WsApiService) { }
  /**
   * POST: Send feedback to endpoint, long timeout as gravity forms is slow.
   *
   * @param body Feedback data
   */
  sendFeedback(body: Feedback): Observable<any> {
    return this.ws.post('/apspacefeedback/submit', { body, timeout: 30000 });
  }

  platform(): string {
    let platform: string;

    if (this.plt.platforms().find(ele => ele === 'core')) {
      platform = this.detectBrowser();
    } else if (this.plt.platforms().find(ele => ele === 'android')) {
      platform = 'Android';
    } else if (this.plt.platforms().find(ele => ele === 'ios')) {
      platform = 'iOS';
    } else if (this.plt.platforms().find(ele => ele === 'windows')) {
      platform = 'Window Mobile';
    } else {
      platform = this.plt.platforms().toString();
    }

    // const versions = this.plt.versions();
    const versions = '123';
    const osVersion = Object.keys(versions).find(p => Boolean(versions[p]));
    const userAgent = navigator.userAgent;

    return [platform, osVersion, userAgent].filter(i => i).join(' ');
  }

  private detectBrowser() {
    // // Opera 8.0+
    // const isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
    // // Firefox 1.0+
    // const isFirefox = typeof InstallTrigger !== 'undefined';
    // // Safari 3.0+ "[object HTMLElementConstructor]"
    // const isSafari = /constructor/i.test(window.HTMLElement) || (
    //   function (p) { return p.toString() === '[object SafariRemoteNotification]'; })(!window['safari']
    //   || (typeof safari !== 'undefined' && safari.pushNotification)
    // );
    // // Internet Explorer 6-11
    // const isIE = /*@cc_on!@*/false || !!document.documentMode;
    // // Edge 20+
    // const isEdge = !isIE && !!window.StyleMedia;
    // // Chrome 1+
    // const isChrome = !!window.chrome && !!window.chrome.webstore;
    // // Blink engine detection
    // const isBlink = (isChrome || isOpera) && !!window.CSS;

    // if (isOpera) {
    //   return 'Opera';
    // }
    // if (isFirefox) {
    //   return 'Firefox';
    // }
    // if (isSafari) {
    //   return 'Safari';
    // }
    // if (isIE) {
    //   return 'Internet Explorer';
    // }
    // if (isEdge) {
    //   return 'Edge';
    // }
    // if (isChrome) {
    //   return 'Chrome';
    // }
    // if (isBlink) {
    //   return 'Blink';
    // }

    // return 'Unavailable';
    return 'Unavailable';
  }

}
