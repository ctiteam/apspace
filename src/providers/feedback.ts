import { HttpClient } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Platform } from 'ionic-angular';

import { Observable } from 'rxjs/Observable';
import { switchMap } from 'rxjs/operators';
import { CasTicketProvider } from '../providers';

declare var detectBrowser;

const FEEDBACK_URL = 'https://api.apiit.edu.my/apspacefeedback';
const SERVICE_URL = 'http://api.apiit.edu.my/';

@Injectable()
export class FeedbackProvider {

  feedbackData: any = {};
  cas: CasTicketProvider;

  constructor(
    public http: HttpClient,
    private plt: Platform,
    private injector: Injector,
  ) { }

  /**
   * POST: Send post request to enpoint
   *
   * @param name user's full name
   * @param email user's contant number
   * @param contactNumber user's contact number
   * @param message feedback message from user
   */
  sendFeedback(name: string, email: string, contactNumber: string, message: string): Observable<any> {
    this.cas = this.injector.get(CasTicketProvider);
    return this.cas.getST(SERVICE_URL).pipe(
      switchMap(st => {
        this.feedbackData['ticket'] = st;
        this.feedbackData['platform'] = this.determinePlatform();
        this.feedbackData['name'] = name;
        this.feedbackData['email'] = email;
        this.feedbackData['contact_number'] = contactNumber;
        this.feedbackData['message'] = message;
        const options = {
          headers: { 'Content-type': 'application/json' },
        };
        return this.http.post(`${FEEDBACK_URL}/user/feature_request`, this.feedbackData, options);
      }),
    );
  }

  determinePlatform(): string {
    if (this.plt.platforms().find(ele => ele === "core")) {
      return detectBrowser();
    } else if (this.plt.platforms().find(ele => ele === "android")) {
      return "Android";
    } else if (this.plt.platforms().find(ele => ele === "ios")) {
      return "iOS";
    } else if (this.plt.platforms().find(ele => ele === "windows")) {
      return "Window Mobile"
    } else {
      return this.plt.platforms().toString();
    }
  }

}
