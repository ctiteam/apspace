import { Component, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { OrientationStudentDetails } from 'src/app/interfaces';
@Component({
  selector: 'page-request-update-modal-modal',
  templateUrl: 'request-update-modal.html',
  styleUrls: ['request-update-modal.scss']
})

export class RequestChangeModalPage implements OnInit {

  updatedOrientationProfile: OrientationStudentDetails;

  /* input from profile page */
  orientationProfile: OrientationStudentDetails;

  constructor(
    private modalCtrl: ModalController,
    private toastCtrl: ToastController
  ) { }

  ngOnInit() {
    // clone the object, the backend needs the new object and the old one
    this.updatedOrientationProfile = JSON.parse(JSON.stringify(this.orientationProfile));
  }

  submit() {
    if (this.orientationProfile.councelor_details.length < 1) {
      this.showToastMessage('No E-Counsellor Has Been Assigned To You Yet! Please Contact The Admin Office.', 'danger');
    } else {
      // request body, COUNSELLOR_EMAIL is always requried
      const body = {
        COUNSELLOR_EMAIL: this.orientationProfile.councelor_details[0].EMAIL
      };

      // new data
      const newStudentDetails = this.updatedOrientationProfile.student_details[0];
      const newCounselorDetails = this.updatedOrientationProfile.councelor_details[0];

      // loop throught the form and found values that has been changed
      for (const key in newStudentDetails) {
        if (newStudentDetails.hasOwnProperty(key)) {
          if (this.orientationProfile.student_details[0][key] !== newStudentDetails[key]) {
            body['NEW_' + key] = newStudentDetails[key];
            body['OLD_' + key] = this.orientationProfile.student_details[0][key];
          }
        }
      }
      for (const key in newCounselorDetails) {
        if (newCounselorDetails.hasOwnProperty(key)) {
          if (this.orientationProfile.councelor_details[0][key] !== newCounselorDetails[key]) {
            body['NEW_' + key] = newCounselorDetails[key];
            body['OLD_' + key] = this.orientationProfile.councelor_details[0][key];

          }
        }
      }
      if (Object.keys(body).length <= 1) {
        this.showToastMessage('Nothing Has Been Changed In The Form, Request Cannot Be Submitted Without Any Changes.', 'danger');
      } else {
        this.showToastMessage('Your Request Change Has Been Submitted Successfully. The Team Will Review Your Request Now.', 'success');
        console.log('request: ', body);
      }
    }
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }

  showToastMessage(message: string, color: 'danger' | 'success') {
    this.toastCtrl
      .create({
        message,
        duration: 6000,
        position: 'top',
        color,
        showCloseButton: true,
        animated: true
      })
      .then(toast => toast.present());
  }
}
