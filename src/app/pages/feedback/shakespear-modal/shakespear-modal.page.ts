import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { FeedbackService, VersionService } from 'src/app/services';

@Component({
  selector: 'app-shakespear-modal',
  animations: [
    trigger('slideIn', [
      state('*', style({ 'overflow-y': 'hidden' })),
      state('void', style({ 'overflow-y': 'hidden' })),
      transition('* => void', [
        style({ height: '*' }),
        animate(250, style({ height: 0 }))
      ]),
      transition('void => *', [
        style({ height: '0' }),
        animate(250, style({ height: '*' }))
      ])
    ])
  ],
  templateUrl: './shakespear-modal.page.html',
  styleUrls: ['./shakespear-modal.page.scss'],
})
export class ShakespearModalPage implements OnInit {

  @Input() imagePath: string;

  showImage = false;
  phoneNumberValidationPattern = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4,5})$/;
  phoneNumberValid = false;

  onlineFeedbackSystemURL = 'https://erp.apiit.edu.my/easymoo/web/en/user/feedback/feedbackusersend';

  contactNo = '';
  message = '';
  platform: string;
  appVersion: string;

  submitting = false;
  readonly screenSize = screen.width + 'x' + screen.height;
  loading: HTMLIonLoadingElement;

  constructor(
    private router: Router,
    private feedback: FeedbackService,
    private toastCtrl: ToastController,
    private version: VersionService,
    private loadingController: LoadingController
  ) { }

  toggleImage() {
    this.showImage = !this.showImage;
  }

  submitFeedback() {
    const feedback = {
      contactNo: this.contactNo || '',
      platform: this.platform,
      message: this.message + '\n' + `Url: ${this.router.url}` + '\n' + 'Image Url:' + this.imagePath,
      appVersion: this.appVersion,
      screenSize: this.screenSize,
    };
    this.presentLoading();
    this.submitting = true;
    this.feedback.sendFeedback(feedback).subscribe(_ => {
      this.message = '';
      this.toastCtrl.create({
        // tslint:disable-next-line: max-line-length
        message: '<span style="font-weight: bold;">Feedback submitted! </span> The team will get back to you as soon as possbile via Email. Thank you for your feedback',
        position: 'top',
        color: 'success',
        duration: 5000,
        showCloseButton: true,
      }).then(toast => toast.present());
      this.submitting = false;
      this.dismissLoading();
    }, err => {
      this.toastCtrl.create({
        message: err.message,
        cssClass: 'danger',
        position: 'top',
        duration: 5000,
        showCloseButton: true,
      }).then(toast => toast.present());
      // finally not invoked as error does not complete
      this.dismissLoading();
      this.submitting = false;
    });
  }

  ngOnInit() {
    this.platform = this.feedback.platform();
    this.appVersion = this.version.name;
  }

  onMessageFieldChange(event) {
    this.message = event.trim();
  }

  onPhoneNumberChange() {
    this.phoneNumberValid = this.contactNo.match(this.phoneNumberValidationPattern) !== null;
  }

  async presentLoading() {
    this.loading = await this.loadingController.create({
      spinner: 'dots',
      duration: 5000,
      message: 'Please wait...',
      translucent: true,
    });
    return await this.loading.present();
  }

  async dismissLoading() {
    return await this.loading.dismiss();
  }

}
