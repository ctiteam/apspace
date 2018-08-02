import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Platform, ToastController } from 'ionic-angular';
import { Device } from '@ionic-native/device';

import { CasTicketProvider, LoadingControllerProvider } from '../providers';


const FEEDBACK_URL = "https://rgnsa0bpif.execute-api.ap-southeast-1.amazonaws.com/dev";
const SERVICE_URL = "http://ws.apiit.edu.my/";

@Injectable()
export class FeedbackProvider {

  feedbackData: any = {
    service_ticket: '',
    contact_number: '',
    message: '',
  };

  constructor(
    public http: HttpClient,
    private cas: CasTicketProvider,
    private device: Device,
    private plt: Platform,
    private laoding: LoadingControllerProvider,
    private toastCtrl: ToastController,
  ) {}

  /**
   * POST: Send post request to enpoint
   *
   * @param contactNumber - user's contact number
   * @param message - feedback message from user
   */
  sendFeedback(contactNumber: string, message: string){
    this.laoding.presentLoading();
    let deviceInfo = '';
    this.feedbackData.contact_number = contactNumber;
    this.feedbackData.message = message;
    this.cas.getST(SERVICE_URL).subscribe(res=> {
      this.feedbackData.service_ticket = res;
      if(this.plt.is("cordova")){
        deviceInfo = "Platform: " + this.device.platform + '<br>'
        + "Cordova: " + this.device.cordova + '<br>'
        + "OS Version: " + this.device.version + '<br>'
        + "Model: " + this.device.model + '<br>'
        + "Manufacturer: " + this.device.manufacturer + '<br>'
        + "isVirtual: " + this.device.isVirtual;
      }
      this.feedbackData.contact_number = contactNumber;
      this.feedbackData.message = message + '<br><br>' + deviceInfo;

      const options = {
        headers: { 'Content-type': 'application/json' },
      };

      this.http.post(`${FEEDBACK_URL}/user/feature_request`, this.feedbackData, options)
      .subscribe(res => {
        this.laoding.dismissLoading();
        this.toastCtrl.create({ message: "Feedback submitted!", position: 'bottom', duration: 3000 }).present();
      }), err => {
        this.laoding.dismissLoading();
        this.toastCtrl.create({ message: "Failed submitting feedback!", position: 'bottom', duration: 3000 }).present();
      }
    })
  }

}
