import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { ActionSheetController, LoadingController, ModalController, ToastController } from '@ionic/angular';

import { FeedbackService, VersionService } from 'src/app/services';

@Component({
  selector: 'app-shakespear-modal',
  animations: [
    trigger('slideLeft', [
      transition('void => *', [
        style({ opacity: 0, transform: 'translateX(150%)' }),
        animate('200ms 100ms ease-out', style({ transform: 'translateX(0%)', opacity: 1 }))
      ])
    ]),
    trigger('slideIn', [
      state('*', style({ 'overflow-y': 'hidden' })),
      state('void', style({ 'overflow-y': 'hidden' })),
      transition('* => void', [
        style({ height: '*' }),
        animate(250, style({ height: 0 }))
      ]),
    ])
  ],
  templateUrl: './shakespear-modal.page.html',
  styleUrls: ['./shakespear-modal.page.scss'],
})
export class ShakespearModalPage implements OnInit {
  @Input() imagePath: string;

  showImage = false;
  images = [];

  phoneNumberValidationPattern = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4,5})$/;
  phoneNumberValid = false;
  contactNo = '';
  message = '';
  platform: string;
  appVersion: string;

  submitting = false;
  readonly screenSize = screen.width + 'x' + screen.height;
  loading: HTMLIonLoadingElement;

  screenshotSliderOpts = {
    autoplay: false,
    initialSlide: 0,
    speed: 400,
    slidesPerView: 3,
    autoHeight: true,
    preloadImages: true,
    updateOnImagesReady: true,
  };

  constructor(
    private router: Router,
    private feedback: FeedbackService,
    private toastCtrl: ToastController,
    private actionSheetCtrl: ActionSheetController,
    private version: VersionService,
    private loadingController: LoadingController,
    private camera: Camera,
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {
    this.platform = this.feedback.platform();
    this.appVersion = this.version.name;
    this.images.push(this.imagePath);

    setTimeout(() => {
      this.showImage = true;
    }, 500);
  }

  toggleImage() {
    this.showImage = !this.showImage;
  }

  removeImage(image: string) {
    this.images = this.images.filter(imgUrl => imgUrl !== image);
  }

  pickImage(srcType: any) {
    const options: CameraOptions = {
      quality: 30,
      sourceType: srcType,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    };

    this.camera.getPicture(options).then((imageData: string) => {
      if (imageData.startsWith('/9j')) {
        const base64image = 'data:image/jpeg;base64,' + imageData;
        this.images.push(base64image);
      } else {
        this.images.push(imageData);
      }
    }, (err) => {
      if (err === 'cordova_not_available') {
        this.presentToast('Only available on Mobile', 'danger');
      } else {
        this.presentToast('You did not give APSpace Permission to storage', 'danger');
      }
    });
  }

  async browseImage() {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Please select',
      buttons: [
        {
          text: 'Capture image',
          handler: () => {
            this.pickImage(this.camera.PictureSourceType.CAMERA);
          }
        },
        {
          text: 'Load from gallery',
          handler: () => {
            this.pickImage(this.camera.PictureSourceType.PHOTOLIBRARY);
          }
        },
        {
          text: 'Cancel',
          role: 'Cancel'
        }
      ]
    });

    await actionSheet.present();
  }

  async presentToast(msg: string, color: string = 'primary') {
    const toast = await this.toastCtrl.create({
      header: msg,
      position: 'top',
      duration: 3000,
      color,
      buttons: [
        {
          icon: 'close',
          role: 'cancel',
          handler: () => { }
        }
      ]
    });

    await toast.present();
  }

  submitFeedback() {
    const feedback = {
      contactNo: this.contactNo || '',
      platform: this.platform,
      message: this.message,
      mobile: 'Yes', // Confident that Shakespear will only work on Devices with 'Cordova'.
      attachments: this.images.map((img: string) => img.replace('data:image/jpeg;base64,', '').trim()).join('&&'),
      pageUrl: `${this.router.url}`,
      appVersion: this.appVersion,
      screenSize: this.screenSize,
    };
    this.presentLoading();
    this.submitting = true;
    this.feedback.sendFeedback(feedback).subscribe(_ => {
      this.message = '';
      this.toastCtrl.create({
        // tslint:disable-next-line: max-line-length
        message: '<span style="font-weight: bold;">Feedback submitted! </span> The team will get back to you as soon as possible via Email. Thank you for your feedback',
        position: 'top',
        color: 'success',
        duration: 5000,
        buttons: [
          {
            text: 'Close',
            role: 'cancel'
          }
        ],
      }).then(toast => toast.present());
    }, err => {
      this.toastCtrl.create({
        message: err.message,
        cssClass: 'danger',
        position: 'top',
        duration: 5000,
        buttons: [
          {
            text: 'Close',
            role: 'cancel'
          }
        ],
      }).then(toast => toast.present());
      // finally not invoked as error does not complete
      this.dismissLoading();
      this.submitting = false;
    }, () => {
      this.submitting = false;
      this.dismissLoading();
      this.modalCtrl.dismiss();
    });
  }

  onMessageFieldChange(event: any) {
    this.message = event.trim();
  }

  onPhoneNumberChange() {
    this.phoneNumberValid = this.contactNo.match(this.phoneNumberValidationPattern) !== null;
  }

  async presentLoading() {
    this.loading = await this.loadingController.create({
      spinner: 'dots',
      duration: 10000,
      message: 'Please wait...',
      translucent: true,
    });
    return await this.loading.present();
  }

  async dismissLoading() {
    return await this.loading.dismiss();
  }

}
