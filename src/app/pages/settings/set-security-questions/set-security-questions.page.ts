import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';
import { finalize } from 'rxjs/operators';
import { SecurityQuestionsAndAnswers } from 'src/app/interfaces';
import { WsApiService } from 'src/app/services';
// import { toastMessageEnterAnimation } from 'src/app/animations/toast-message-animation/enter';
// import { toastMessageLeaveAnimation } from 'src/app/animations/toast-message-animation/leave';

// THIS REGULAR EXPERSSION FOLLOWS THE RFC 2822 STANDARD
// tslint:disable-next-line: max-line-length
const EMAIL_VALIDATION_REG_EXP = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

@Component({
  selector: 'app-set-security-questions',
  templateUrl: './set-security-questions.page.html',
  styleUrls: ['./set-security-questions.page.scss'],
})
export class SetSecurityQuestionsPage implements OnInit {
  showEmailNotValidMsg = false;
  qa = {} as SecurityQuestionsAndAnswers;
  isLoading = false;

  constructor(
    private ws: WsApiService,
    private toastCtrl: ToastController,
    public alertCtrl: AlertController
  ) { }

  ngOnInit() {
    this.getConfig();
  }

  onEmailChanging() {
    this.showEmailNotValidMsg = !this.qa.secondaryEmail.match(EMAIL_VALIDATION_REG_EXP);
  }

  getConfig() {
    this.isLoading = true;
    this.ws.get<SecurityQuestionsAndAnswers>('/sqa/')
      .pipe(finalize(() => this.isLoading = false))
      .subscribe(qa => this.qa = qa);
  }

  setConfig(formData: SecurityQuestionsAndAnswers) {
    this.alertCtrl.create({
      header: 'Update Security Questions',
      message:
        'You are about to update your security questios and your secondary email'
        + ' which are used to recover your password in case you forget it.'
        + ' Do you want to continue?',
      buttons: [
        {
          text: 'No',
          handler: () => {
          }
        },
        {
          text: 'Yes',
          handler: () => {
            const body = new HttpParams({ fromObject: { ...formData } }).toString();
            const headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
            this.ws.post('/sqa/', { body, headers }).subscribe(
              _ => { },
              _ => {
                this.showToastMessage(
                  'Something went wrong and we couldn not complete your request. Please try again or contact us via the feedback page',
                  'danger'
                );
              },
              () => {
                this.showToastMessage('Your security question and secondary email have been updated successfully.', 'success');
              }
            );
          }
        }
      ]
    }).then(confirm => confirm.present());
  }

  showToastMessage(message: string, colorToShow: string) {
    this.toastCtrl.create({
      message,
      duration: 6000,
      showCloseButton: true,
      position: 'top',
      animated: true,
      color: colorToShow,
      // enterAnimation: toastMessageEnterAnimation,
      // leaveAnimation: toastMessageLeaveAnimation
    }).then(toast => toast.present());
  }

}
