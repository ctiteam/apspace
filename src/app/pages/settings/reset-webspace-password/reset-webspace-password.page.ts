import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
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
    private storage: Storage,
    private toastCtrl: ToastController,
    private loadingController: LoadingController,
    private alertCtrl: AlertController,
    private webspacePasswordService: WebspacePasswordService
  ) { }

  ngOnInit() {
    this.storage.get('/student/profile').then(
      studentProfile => {
        this.username = studentProfile.STUDENT_NUMBER;
      }
    );

    this.resetWebspaceIDPasswordForm = new FormGroup({
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
            this.webspacePasswordService.resetPassword(this.resetWebspaceIDPasswordForm.value.ICOrPassportNumber)
            .subscribe({
              next: _ => {
                this.presentToast('Your password has been reset. Please check your Email for the new password.', 'success');
                this.router.navigate(['/settings']);
              },
              error: (err) => {
                this.dismissLoading();
                // tslint:disable-next-line: max-line-length
                this.presentToast(err.error.error, 'danger');
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
