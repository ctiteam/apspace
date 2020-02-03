import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';

import { tap } from 'rxjs/operators';
import { Role, StaffProfile, StudentProfile } from 'src/app/interfaces';
import { CasTicketService, ChangePasswordService, SettingsService, WsApiService } from '../../../services';
import { PasswordValidator } from '../../../validators/password.validator';

@Component({
  selector: 'change-password',
  templateUrl: './change-password.page.html',
  styleUrls: ['./change-password.page.scss'],
})
export class ChangePasswordPage implements OnInit {
  loading: HTMLIonLoadingElement;
  isStudent = false;
  username = '';
  changePasswordForm: FormGroup;
  currentPassword = '';
  passwordLengthMatch = false;
  hasUpperCase = false;
  hasLowerCase = false;
  hasDigit = false;
  hasSpeacialCharacter = false;

  constructor(
    private router: Router,
    private toastCtrl: ToastController,
    private loadingController: LoadingController,
    private changePasswordService: ChangePasswordService,
    private settings: SettingsService,
    private ws: WsApiService,
    private cas: CasTicketService,
    private alertCtrl: AlertController
  ) { }

  ngOnInit() {
    // tslint:disable-next-line: no-bitwise
    this.isStudent = Boolean(this.settings.get('role') & Role.Student);
    this.getUserUsername(); // username is needed to validate the current password with cas
    this.changePasswordForm = new FormGroup({
      new_password: new FormControl('', [Validators.required]),
      confirm_password: new FormControl('', [Validators.required]),
    }, { validators: PasswordValidator }
    );
  }

  getUserUsername() {
    if (this.isStudent) {
      this.ws.get<StudentProfile>('/student/profile', { caching: 'cache-only' }).pipe(
        tap(studentProfile => this.username = studentProfile.STUDENT_NUMBER),
      ).subscribe();
    } else {
      this.ws.get<StaffProfile>('/staff/profile', { caching: 'cache-only' }).pipe(
        tap(staffProfile => {
          this.username = staffProfile[0].ID;
        }),
      ).subscribe();
    }
  }

  changePassword() {
    this.presentLoading();
    this.cas.getTGT(this.username, this.currentPassword).subscribe( // get tgt to check if current password is correct
      {
        next: _ => {
          this.dismissLoading();
          this.presentAlert();
        },
        error: _ => { // tgt is invalid => current password is incorrect
          this.dismissLoading();
          this.presentToast('The current password you have entered is incorrect', 'danger');
        }
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
      subHeader: 'You are about to update your APKey Password',
      // tslint:disable-next-line: max-line-length
      message: 'After clicking "Continue", you will be automatically logged out from the application for security reasons. Also, we advise you to log out and log in again to all other applications that require APKey authentication',
      buttons: [
        {
          text: 'Back',
          handler: () => { }
        },
        {
          text: 'Continue',
          handler: () => {
            this.presentLoading();
            if (this.isStudent) { // user is student => calling the change password api for student
              this.changePasswordService.changePasswordStudent(this.changePasswordForm.value)
                .subscribe({

                  next: _ => {
                    this.presentToast('Your passowrd has been changed. Please log in again', 'success');
                    this.router.navigate(['/logout']);
                  },
                  error: _ => {
                    this.dismissLoading();
                    // tslint:disable-next-line: max-line-length
                    this.presentToast('Something went wrong from our side. Please try again or contact us via the feedback page', 'danger');
                  },
                  complete: () => this.dismissLoading()
                });
            } else { // user is staff => calling the change password api for staff
              this.changePasswordService.changePassword(this.changePasswordForm.value)
                .subscribe({
                  next: _ => {
                    this.presentToast('Your password has been changed. Please log in again', 'success');
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
        }
      ]
    }).then(confirm => confirm.present());
  }

  checkValidation(event) {
    const newPassword = event.detail.value;
    const upperCaseRegExp = /^(?=.*[A-Z])/;
    const lowerCaseRegExp = /^(?=.*[a-z])/;
    const digitRegExp = /^(?=.*\d)/;
    const specialCharacterRegExp = /(?=.*?[#?!@$%~()_{}-])/;
    if (upperCaseRegExp.test(newPassword)) {
      this.hasUpperCase = true;
    } else {
      this.hasUpperCase = false;
    }
    if (digitRegExp.test(newPassword)) {
      this.hasDigit = true;
    } else {
      this.hasDigit = false;
    }
    if (lowerCaseRegExp.test(newPassword)) {
      this.hasLowerCase = true;
    } else {
      this.hasLowerCase = false;
    }
    if (newPassword.length < 8) {
      this.passwordLengthMatch = false;
    } else {
      this.passwordLengthMatch = true;
    }
    if (specialCharacterRegExp.test(newPassword)) {
      this.hasSpeacialCharacter = true;
    } else {
      this.hasSpeacialCharacter = false;
    }
  }
}
