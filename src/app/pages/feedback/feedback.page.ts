import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';

import { FeedbackService, SettingsService, VersionService } from '../../services';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.page.html',
  styleUrls: ['./feedback.page.scss'],
})
export class FeedbackPage implements OnInit {

  phoneNumberValidationPattern = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4,5})$/;
  phoneNumberValid = false;
  onlineFeedbackSystemURL = 'https://erp.apiit.edu.my/easymoo/web/en/user/feedback/feedbackusersend';
  contactNo: string;
  message: string;

  submitting = false;

  readonly screenSize = screen.width + 'x' + screen.height;
  platform: string;
  appVersion: string;

  constructor(
    private feedback: FeedbackService,
    private settings: SettingsService,
    private toastCtrl: ToastController,
    private version: VersionService,
    private iab: InAppBrowser
  ) { }

  submitFeedback() {
    const feedback = {
      contactNo: this.contactNo || '',
      platform: this.platform,
      message: this.message,
      appVersion: this.appVersion,
      screenSize: this.screenSize,
    };

    this.submitting = true;
    this.feedback.sendFeedback(feedback).subscribe(_ => {
      this.settings.set('contactNo', this.contactNo);

      this.message = '';
      this.contactNo = '';
      this.toastCtrl.create({
        message: 'Feedback submitted!',
        position: 'top',
        duration: 3000,
      }).then(toast => toast.present());
      this.submitting = false;
    }, err => {
      this.toastCtrl.create({
        message: err.message,
        cssClass: 'danger',
        position: 'top',
        duration: 3000,
      }).then(toast => toast.present());
      // finally not invoked as error does not complete
      this.submitting = false;
    });
  }

  ngOnInit() {
    this.contactNo = this.settings.get('contactNo');
    this.platform = this.feedback.platform();
    this.appVersion = this.version.name;
  }

  onMessageFieldChange(event) {
    this.message = event.trim();
  }

  onPhoneNumberChange() {
    if (this.contactNo) {
      if (this.contactNo.match(this.phoneNumberValidationPattern)) {
        this.phoneNumberValid = true;
      } else {
        this.phoneNumberValid = false;
      }
    }
  }

  openOnlineFeedbackSystem() {
    this.iab.create(`${this.onlineFeedbackSystemURL}`, '_blank', 'location=true');
  }

}
