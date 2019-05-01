import { Component } from '@angular/core';
import { IonicPage, ToastController } from 'ionic-angular';

import { FeedbackProvider, VersionProvider } from '../../providers';
import { InAppBrowser } from '@ionic-native/in-app-browser';

@IonicPage()
@Component({
  selector: 'page-feedback',
  templateUrl: 'feedback.html',
})
export class FeedbackPage {
  onlineFeedbackSystemURL = 'https://erp.apiit.edu.my/easymoo/web/en/user/feedback/feedbackusersend';
  contactNo: string;
  message: string;
  platform: string;
  appVersion: string;

  phoneNumberValidationPattern = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4,5})$/;
  phoneNumberValid = true;
  submitting = false;

  readonly screenSize = screen.width + 'x' + screen.height;

  constructor(
    private feedback: FeedbackProvider,
    private toastCtrl: ToastController,
    private version: VersionProvider,
    private iab: InAppBrowser
  ) { }

  submitFeedback() {
    this.submitting = true;
    const feedback = {
      contactNo: this.contactNo || "",
      platform: this.platform,
      message: this.message,
      appVersion: this.appVersion,
      screenSize: this.screenSize,
    };

    this.feedback.sendFeedback(feedback).subscribe(_ => {
    }, err => {
      this.toastCtrl.create({
        message: err.message,
        cssClass: 'danger',
        position: 'top',
        duration: 3000,
      }).present();
      // finally not invoked as error does not complete
      this.submitting = false;
    },
      () => {
        this.message = '';
        this.contactNo = '';
        this.toastCtrl.create({
          message: 'Feedback submitted!',
          position: 'top',
          duration: 3000,
        }).present();
        this.submitting = false;
      });
  }

  ionViewDidLoad() {
    this.platform = this.feedback.platform();
    this.appVersion = this.version.name;
  }

  openOnlineFeedbackSystem() {
    this.iab.create(`${this.onlineFeedbackSystemURL}`, '_blank', 'location=true');
  }

  onPhoneNumberChange(){
    if(this.contactNo){
      if(this.contactNo.match(this.phoneNumberValidationPattern)){
        this.phoneNumberValid = true;
      }
    }
  }

  onExitingPhoneNumberField() {
    if (this.contactNo) {
      if (this.contactNo.match(this.phoneNumberValidationPattern)) {
        this.phoneNumberValid = true;
      }
      else {
        this.phoneNumberValid = false;
      }
    }
  }
}
