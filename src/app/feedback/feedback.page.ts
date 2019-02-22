import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';

import { FeedbackService, SettingsService, VersionService } from '../services';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.page.html',
  styleUrls: ['./feedback.page.scss'],
})
export class FeedbackPage implements OnInit {

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

}
