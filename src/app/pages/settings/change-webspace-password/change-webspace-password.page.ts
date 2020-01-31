import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';

import { Router } from '@angular/router';
import { WebspacePasswordService } from 'src/app/services/webspace-password.service';
import { PasswordValidator } from '../../../validators/password.validator';

@Component({
  selector: 'app-change-webspace-password',
  templateUrl: './change-webspace-password.page.html',
  styleUrls: ['./change-webspace-password.page.scss'],
})
export class ChangeWebspacePasswordPage {
  loading: HTMLIonLoadingElement;
  changePasswordForm = new FormGroup({
    current_password: new FormControl('', [Validators.required]),
    new_password: new FormControl('', [Validators.required]),
    confirm_password: new FormControl('', [Validators.required])
  }, { validators: PasswordValidator });
  // passwordLengthMatch = false;
  // hasUpperCase = false;
  // hasLowerCase = false;
  // hasDigit = false;
  // hasSpeacialCharacter = false;

  constructor(
    private router: Router,
    private toastCtrl: ToastController,
    private loadingController: LoadingController,
    private webspacePasswordService: WebspacePasswordService,
    private alertCtrl: AlertController
  ) { }

  changePassword() {
    if (!this.changePasswordForm.valid) {
      this.presentToast('The current password you have entered is incorrect', 'danger');
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
      subHeader: 'You are about to change your Webspace password.',
      // tslint:disable-next-line: max-line-length
      message: 'After clicking "Continue", your Webspace password will be changed with the new password.',
      buttons: [
        {
          text: 'Back',
          handler: () => { }
        },
        {
          text: 'Continue',
          handler: () => {
            this.presentLoading();
            const changePassword = {
              current: this.changePasswordForm.value.current_password,
              new: this.changePasswordForm.value.new_password
            };
            this.webspacePasswordService.changePassword(changePassword)
            .subscribe({
              next: _ => {
                this.presentToast('Your Webspace password has been changed.', 'success');
                this.router.navigate(['/settings']);
              },
              error: (err) => {
                this.dismissLoading();
                // tslint:disable-next-line: max-line-length
                this.presentToast(err.error.msg.replace('Error: ', '') + ' Please try again or contact us via the feedback page', 'danger');
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
