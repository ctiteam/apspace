import { HttpClient } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Device } from '@ionic-native/device';
import { Platform } from 'ionic-angular';

import { Observable } from 'rxjs/Observable';
import { finalize, switchMap } from 'rxjs/operators';
import { CasTicketProvider, LoadingControllerProvider } from '../providers';

const FEEDBACK_URL = 'https://rgnsa0bpif.execute-api.ap-southeast-1.amazonaws.com/dev';
const SERVICE_URL = 'http://ws.apiit.edu.my/';

@Injectable()
export class FeedbackProvider {

  feedbackData: any = {
    contact_number: '',
    device_info: '',
    email: '',
    message: '',
    name: '',
    service_ticket: '',
  };
  cas: CasTicketProvider;
  loading: LoadingControllerProvider;

  constructor(
    public http: HttpClient,
    private device: Device,
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
    this.loading = this.injector.get(LoadingControllerProvider);
    this.cas = this.injector.get(CasTicketProvider);
    this.loading.presentLoading();
    return this.cas.getST(SERVICE_URL).pipe(
      switchMap(st => {
        this.feedbackData.service_ticket = st;
        if (this.plt.is('cordova')) {
          this.feedbackData.device_info = 'Platform: ' + this.device.platform + '\n'
            + 'Cordova: ' + this.device.cordova + '\n'
            + 'OS Version: ' + this.device.version + '\n'
            + 'Model: ' + this.device.model + '\n'
            + 'Manufacturer: ' + this.device.manufacturer + '\n'
            + 'isVirtual: ' + this.device.isVirtual;
        }
        this.feedbackData.name = name;
        this.feedbackData.email = email;
        this.feedbackData.contact_number = contactNumber;
        this.feedbackData.message = message;
        const options = {
          headers: { 'Content-type': 'application/json' },
        };
        return this.http.post(`${FEEDBACK_URL}/user/feature_request`, this.feedbackData, options);
      }),
      finalize(() => this.loading.dismissLoading()),
    );
  }

}
