import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
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
  ) { }

  ngOnInit() {
    // clone the object, the backend needs the new object and the old one
    this.updatedOrientationProfile = JSON.parse(JSON.stringify(this.orientationProfile));
  }

  submit() {
    console.log('current', this.orientationProfile);
    console.log('new', this.updatedOrientationProfile);
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }
}
