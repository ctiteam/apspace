import { Component, OnInit } from '@angular/core';
import { Camera } from '@ionic-native/camera/ngx';
import { LoadingController, Platform, ToastController } from '@ionic/angular';
import * as Tesseract from 'tesseract.js';

@Component({
  selector: 'app-filing-report',
  templateUrl: './filing-report.page.html',
  styleUrls: ['./filing-report.page.scss'],
})
export class FilingReportPage implements OnInit {
  studentIDRegExp = /^[A-Z]{2}[0-9]{6}$/;
  readPolicyCheckbox = false;
  loading: HTMLIonLoadingElement;
  categories = [
    'Attire',
    'Behaviour',
  ];
  studentId = '';
  description = '';
  selectedImage = '';
  selectedCategory = this.categories[0];
  imageText = '';
  cameraOptions = {
    quality: 100,
    destinationType: this.camera.DestinationType.DATA_URL,
    sourceType: this.camera.PictureSourceType.CAMERA,
    allowEdit: true,
    saveToPhotoAlbum: false,
    correctOrientation: false
  };
  constructor(
    private camera: Camera,
    private loadingController: LoadingController,
    public platform: Platform,
    private toastCtrl: ToastController
  ) { }

  ngOnInit() { }

  getPicture() {
    this.camera.getPicture(this.cameraOptions).then((imageData) => {
      this.selectedImage = `data:image/jpeg;base64,${imageData}`;
      this.recognizeImage(`data:image/jpeg;base64,${imageData}`);
    });
  }

  async presentLoading() {
    this.loading = await this.loadingController.create({
      spinner: 'dots',
      duration: 90000,
      message: 'Analyzing the picture...',
      translucent: true,
    });
    return await this.loading.present();
  }

  async dismissLoading() {
    return await this.loading.dismiss();
  }

  showToastMessage(message: string, color: 'danger' | 'success') {
    this.toastCtrl.create({
      message,
      duration: 6000,
      position: 'top',
      color,
      showCloseButton: true,
      animated: true,
    }).then(toast => toast.present());
  }

  recognizeImage(image: string) {
    this.presentLoading();
    Tesseract.recognize(image)
      .then(result => {
        this.imageText = result.data.text;
        result.data.words.forEach(word => {
          if (word.text.match(this.studentIDRegExp)) {
            this.studentId = word.text;
          }
        });
      })
      .finally(() => {
        console.log('done');
        if (!this.studentId) {
          // tslint:disable-next-line: max-line-length
          this.showToastMessage('Sorry! we couldn\'t identify the student ID from the picture. Either try again or enter it manually', 'danger');
        }
        this.dismissLoading();
      });
  }
}
