import { Component } from '@angular/core';
import { IonicPage, ToastController } from 'ionic-angular';

import { FeedbackProvider, SettingsProvider, VersionProvider } from '../../providers';

@IonicPage()
@Component({
  selector: 'page-feedback',
  templateUrl: 'feedback.html',
})
export class FeedbackPage {

  contactNo: string;
  message: string;

  submitting = false;

  readonly screenSize = screen.width + 'x' + screen.height;
  platform: string;
  appVersion: string;

  constructor(
    private feedback: FeedbackProvider,
    private settings: SettingsProvider,
    private toastCtrl: ToastController,
    private version: VersionProvider,
  ) { }

  submitFeedback() {
    const feedback = {
      contactNo: this.contactNo,
      platform: this.platform,
      message: this.message,
      appVersion: this.appVersion,
      screenSize: this.screenSize,
    };

    this.submitting = true;
    this.feedback.sendFeedback(feedback).subscribe(_ => {
      this.settings.set('contactNo', this.contactNo);

      this.message = '';
      this.toastCtrl.create({
        message: 'Feedback submitted!',
        position: 'top',
        duration: 3000,
      }).present();
      this.submitting = false;
    }, err => {
      this.toastCtrl.create({
        message: err.message,
        cssClass: 'danger',
        position: 'top',
        duration: 3000,
      }).present();
      // finally not invoked as error does not complete
      this.submitting = false;
    });
  }

  ionViewDidLoad() {
    this.contactNo = this.settings.get('contactNo');

    this.platform = this.feedback.platform();
    this.appVersion = this.version.name;
  }

}
