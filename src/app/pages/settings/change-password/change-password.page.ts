import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';

import { ChangePasswordService, SettingsService } from '../../../services';
import { PasswordValidator } from '../../../validators/password.validator';
import { Role } from 'src/app/interfaces';

@Component({
  selector: 'change-password',
  templateUrl: './change-password.page.html',
  styleUrls: ['./change-password.page.scss'],
})
export class ChangePasswordPage implements OnInit {
  loading: HTMLIonLoadingElement;

  changePasswordForm: FormGroup;
  newPassword = '';
  passwordLengthMatch = false;
  hasUpperCase = false;
  hasSpeacialCharacter = false;

  constructor(
    private router: Router,
    private toastCtrl: ToastController,
    private loadingController: LoadingController,
    private changePasswordService: ChangePasswordService,
    private settings: SettingsService,
  ) { }

  ngOnInit() {
    this.changePasswordForm = new FormGroup({
      new_password: new FormControl('', [Validators.required]),
      confirm_password: new FormControl('', [Validators.required]),
    }, { validators: PasswordValidator }
    );
  }

  changePassword() {
    this.presentLoading();
    // tslint:disable-next-line: no-bitwise
    if (this.settings.get('role') & Role.Student) {
      this.changePasswordService.changePasswordStudent(this.changePasswordForm.value)
        .subscribe(
          (res: { result: string }) => {
            this.dismissLoading();
            this.presentToast('Your passowrd has been changed. Please log in again');
            this.router.navigate(['/logout']);
          },

          (error) => {
            this.dismissLoading();
            console.log(error);
          }
        );
    } else {
      this.changePasswordService.changePassword(this.changePasswordForm.value)
        .subscribe(
          (res: { result: string }) => {
            this.dismissLoading();
            this.presentToast('Your passowrd has been changed. Please log in again');
            this.router.navigate(['/logout']);
          },

          (error) => {
            this.dismissLoading();
            console.log(error);
          }
        );
    }
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

  async presentToast(msg: string) {
    const toast = await this.toastCtrl.create({
      message: msg,
      color: 'success',
      showCloseButton: true,
      duration: 4000,
      position: 'top'
    });

    toast.present();
  }

  checkValidation() {
    const upperCaseRegExp = /^(?=.*?[A-Z])/;
    const specialCharacterRegExp = /(?=.*?[#?!@$%~()_{}-])/;
    if (upperCaseRegExp.test(this.newPassword)) {
      this.hasUpperCase = true;
    } else {
      this.hasUpperCase = false;
    }
    if (this.newPassword.length < 8) {
      this.passwordLengthMatch = false;
    } else {
      this.passwordLengthMatch = true;
    }
    if (specialCharacterRegExp.test(this.newPassword)) {
      this.hasSpeacialCharacter = true;
    } else {
      this.hasSpeacialCharacter = false;
    }
  }
}
