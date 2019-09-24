import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';

import { ChangePasswordService } from '../../../services';
import { PasswordValidator } from '../../../validators/password.validator';

@Component({
  selector: 'app-change-password-student',
  templateUrl: './change-password-student.page.html',
  styleUrls: ['./change-password-student.page.scss'],
})
export class ChangePasswordStudentPage implements OnInit {
  loading: HTMLIonLoadingElement;

  changePasswordStudentForm: FormGroup;
  newPassword = '';
  passwordLengthMatch = false;
  hasUpperCase = false;
  hasSpeacialCharacter = false;

  constructor(
    private changePasswordService: ChangePasswordService,
    private alertController: AlertController,
    private router: Router,
    private loadingController: LoadingController
  ) { }

  ngOnInit() {
    this.changePasswordStudentForm = new FormGroup({
      new_password: new FormControl('', [Validators.required]),
      confirm_password: new FormControl('', [Validators.required]),
    }, { validators: PasswordValidator }
    );
  }

  changePasswordStudeent() {
    this.presentLoading();
    this.changePasswordService.changePasswordStudent(this.changePasswordStudentForm.value)
      .subscribe(
        (res: { result: string }) => {
          this.dismissLoading();
          const alert = this.alertController.create({
            header: 'Your Password has been Changed successfully! ',
            message: 'You will be automatically logged-out of the application for security purposes. Please log-in again..',
            animated: true,
            buttons:
              [
                {
                  text: 'OK',
                  cssClass: 'secondary',
                  handler: () => {
                    this.router.navigate(['/logout']);
                  }
                }
              ]

          });
          alert.then(param => param.present());
        },

        (error) => {
          this.dismissLoading();
          console.log(error);
        }
      );
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
