import { animate, style, transition, trigger } from '@angular/animations';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { FeedbackService, VersionService } from 'src/app/services';

@Component({
  selector: 'app-shakespear-modal',
  animations: [
    trigger('slideLeft', [
      transition('void => *', [
        style({ opacity: 0, transform: 'translateX(150%)' }),
        animate('200ms 100ms ease-out', style({ transform: 'translateX(0%)', opacity: 1 }, ))
      ])
    ])
  ],
  templateUrl: './shakespear-modal.page.html',
  styleUrls: ['./shakespear-modal.page.scss'],
})
export class ShakespearModalPage implements OnInit {

  @Input() imagePath: string;

  showImage = false;
  images = ['https://i.imgur.com/GGeAbyD.jpg'];
  onlineFeedbackSystemURL = 'https://erp.apiit.edu.my/easymoo/web/en/user/feedback/feedbackusersend';

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
    on: {
      beforeInit() {
        const swiper = this;
        swiper.classNames.push(`${swiper.params.containerModifierClass}fade`);
        const overwriteParams = {
          pager: false,
          slidesPerView: 3,
          noSwiping: true,
          watchSlidesProgress: true,
          spaceBetween: 0,
          virtualTranslate: true,
          autoHeight: true
        };
        swiper.params = Object.assign(swiper.params, overwriteParams);
        swiper.params = Object.assign(swiper.originalParams, overwriteParams);
      },
      setTranslate() {
        const swiper = this;
        const { slides } = swiper;
        for (let i = 0; i < slides.length; i += 1) {
          const $slideEl = swiper.slides.eq(i);
          const offset$$1 = $slideEl[0].swiperSlideOffset;
          let tx = -offset$$1;
          if (!swiper.params.virtualTranslate) { tx -= swiper.translate; }
          let ty = 0;
          if (!swiper.isHorizontal()) {
            ty = tx;
            tx = 0;
          }
          const slideOpacity = swiper.params.fadeEffect.crossFade
            ? Math.max(1 - Math.abs($slideEl[0].progress), 0)
            : 1 + Math.min(Math.max($slideEl[0].progress, -1), 0);
          $slideEl
            .css({
              opacity: slideOpacity,
            })
            .transform(`translate3d(${tx}px, ${ty}px, 0px)`);
        }
      },
      setTransition(duration) {
        const swiper = this;
        const { slides, $wrapperEl } = swiper;
        slides.transition(duration);
        if (swiper.params.virtualTranslate && duration !== 0) {
          let eventTriggered = false;
          slides.transitionEnd(() => {
            if (eventTriggered) { return; }
            if (!swiper || swiper.destroyed) { return; }
            eventTriggered = true;
            swiper.animating = false;
            const triggerEvents = ['webkitTransitionEnd', 'transitionend'];
            // tslint:disable-next-line: prefer-for-of
            for (let i = 0; i < triggerEvents.length; i += 1) {
              $wrapperEl.trigger(triggerEvents[i]);
            }
          });
        }
      },
    }
  };

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
