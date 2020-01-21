import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { WebspacePasswordService } from 'src/app/services/webspace-password.service';

@Component({
  selector: 'app-reset-webspace-password',
  templateUrl: './reset-webspace-password.page.html',
  styleUrls: ['./reset-webspace-password.page.scss'],
})
export class ResetWebspacePasswordPage implements OnInit {
  resetWebspaceIDPasswordForm: FormGroup;
  loading: HTMLIonLoadingElement;
  isStudent = false;
  username = '';
  currentPassword = '';
  // passwordLengthMatch = false;
  // hasUpperCase = false;
  // hasLowerCase = false;
  // hasDigit = false;
  // hasSpeacialCharacter = false;

  constructor(
    private router: Router,
    private toastCtrl: ToastController,
    private loadingController: LoadingController,
    private alertCtrl: AlertController,
    private webspacePasswordService: WebspacePasswordService
  ) { }

  ngOnInit() {
    this.resetWebspaceIDPasswordForm = new FormGroup({
      usernameOrTPNumber: new FormControl('', [Validators.required]),
      ICOrPassportNumber: new FormControl('', [Validators.required]),
    });
  }

  resetPassword() {
    if (!this.resetWebspaceIDPasswordForm.valid) {
      this.presentToast('Username/TP Number and IC/Passport is required.', 'danger');
      return;
    }

    this.presentAlert();
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

  async presentToast(msg: string, color: string) {
    const toast = await this.toastCtrl.create({
      message: msg,
      color,
      showCloseButton: true,
      duration: 9000,
      position: 'top'
    });

    toast.present();
  }

  presentAlert() {
    this.alertCtrl.create({
      header: 'Warning!',
      subHeader: `You are about to reset your Webspace ID's password.`,
      // tslint:disable-next-line: max-line-length
      message: `After clicking "Continue", your Webspace ID's password will be reset.`,
      buttons: [
        {
          text: 'Back',
          handler: () => { }
        },
        {
          text: 'Continue',
          handler: () => {
            this.presentLoading();
            const resetPassword = {
              passport: this.resetWebspaceIDPasswordForm.value.ICOrPassportNumber
            };
            this.webspacePasswordService.resetPassword(resetPassword)
            .subscribe({
              next: _ => {
                this.presentToast('Your passowrd has been reset.', 'success');
                this.router.navigate(['/logout']);
              },
              error: _ => {
                this.dismissLoading();
                // tslint:disable-next-line: max-line-length
                this.presentToast('Something went wrong from our side. Please try again or contact us via the feedback page', 'danger');
              },
              complete: () => this.dismissLoading()
            });
          }
        }
      ]
    }).then(confirm => confirm.present());
  }

  // checkValidation(event) {
  //   const newPassword = event.detail.value;
  //   const upperCaseRegExp = /^(?=.*[A-Z])/;
  //   const lowerCaseRegExp = /^(?=.*[a-z])/;
  //   const digitRegExp = /^(?=.*\d)/;
  //   const specialCharacterRegExp = /(?=.*?[#?!@$%~()_{}-])/;
  //   if (upperCaseRegExp.test(newPassword)) {
  //     this.hasUpperCase = true;
  //   } else {
  //     this.hasUpperCase = false;
  //   }
  //   if (digitRegExp.test(newPassword)) {
  //     this.hasDigit = true;
  //   } else {
  //     this.hasDigit = false;
  //   }
  //   if (lowerCaseRegExp.test(newPassword)) {
  //     this.hasLowerCase = true;
  //   } else {
  //     this.hasLowerCase = false;
  //   }
  //   if (newPassword.length < 8) {
  //     this.passwordLengthMatch = false;
  //   } else {
  //     this.passwordLengthMatch = true;
  //   }
  //   if (specialCharacterRegExp.test(newPassword)) {
  //     this.hasSpeacialCharacter = true;
  //   } else {
  //     this.hasSpeacialCharacter = false;
  //   }
  // }

}
