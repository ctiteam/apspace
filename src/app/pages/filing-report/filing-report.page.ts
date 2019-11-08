import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, Platform, ToastController } from '@ionic/angular';
import { WsApiService } from 'src/app/services';

@Component({
  selector: 'app-filing-report',
  templateUrl: './filing-report.page.html',
  styleUrls: ['./filing-report.page.scss'],
})
export class FilingReportPage implements OnInit {
  readPolicyCheckbox = false;
  loading: HTMLIonLoadingElement;
  stagingUrl = 'http://forms.sites-staging.apiit.edu.my/wp-json/gf/v2';
  mainCategories = [
    'Attire',
    'Behaviour',
  ];
  subCategories = [
    { title: 'Jogging pants, Cargo pants, Yoga pants, Gym tights/Leotards, Sports tights', show: 'always' },
    { title: 'No Student ID Card', show: 'always' },
    { title: 'Jeans/Pants with Denim Material', show: 'Monday-Thursday' },
    { title: 'Collared  & Activity T-shirts', show: 'Monday-Thursday' },
    { title: 'Sandals (Male), Slippers, Flip-Flops, Slip-ons', show: 'always' },
    { title: 'Short pants', show: 'always' },
    { title: 'Revealing Blouses (Bare-back, Off-shoulder, Crop-top, Deep-V, Spaghetti Strap)', show: 'always' },
    { title: 'Piercing except for ears/nose', show: 'always' },
    { title: 'Ripped/Torn jeans', show: 'always' },
    { title: 'Round neck T-shirts', show: 'always' },
    { title: 'Caps, Hats, Non-customary Headgears', show: 'always' },
  ];
  locations = [
    'Academic Offices',
    'Admin Services Office',
    'Auditoriums',
    'Bursary & Finance Service Counters',
    'Career Services Office',
    'Classrooms',
    'Corridors & Open Spaces within Teaching Blocks',
    'Exam Halls',
    'Immigration Services Office',
    'Laboratories & Workshops',
    'Lecture Halls',
    'Libraries',
    'Student Services Office',
  ];

  days = ['Monday-Thursday', 'Friday'];
  studentId = 'TP';
  description = '';
  selectedMainCategory = this.mainCategories[0];
  selectedSubCategory = this.subCategories[0].title;
  selectedDay = new Date().getDay() !== 5 ? this.days[0] : this.days[1];
  selectedLocation = this.locations[0];
  totalSteps = new Array(3);
  currentStepNumber = 0;
  constructor(
    private loadingController: LoadingController,
    public platform: Platform,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    private ws: WsApiService
  ) { }

  ngOnInit() { }

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

  nextStep() {
    this.currentStepNumber++;
    if (this.currentStepNumber === 1 && this.studentId === 'TP037354') {
      console.log('yes');
    }
  }

  cancel() {
    this.studentId = 'TP';
    this.currentStepNumber = 0;
    this.description = '';
  }

  submitReport() {
    this.alertCtrl.create({
      header: 'Confirm!',
      subHeader: 'You are about to file a report against the student with ID TP037354. Do you want to continue?',
      buttons: [
        {
          text: 'No',
          handler: () => { }
        },
        {
          text: 'Yes',
          handler: () => {
            // START THE LOADING
            this.presentLoading();
            const body = {
              form_id: 157,
              1: 'TP037354',
              2: 'some description',
              4: 'Classrooms',
              5: 'Friday',
              6: 'Jeans'
            };
            const headers = new HttpHeaders();
            headers.append('Content-Type', 'application/json');
            headers.append('Authorization', 'Basic ' + btoa('gravityformsapi:uee9DPh7r8Q9r20qG5fokRxl'));
            this.ws.post<any>('/entries', {
              body,
              headers,
              url: this.stagingUrl
            }).subscribe(
              {
                next: res => {
                  console.log(res);
                  this.showToastMessage('Student behaviors has been updated successfully!', 'success');
                },
                error: err => {
                  console.log(err);
                  this.showToastMessage('Something went wrong! please try again or contact us via the feedback page', 'danger');
                  this.cancel(); // reset the form
                },
                complete: () => {
                  this.dismissLoading();
                  this.cancel(); // reset the form
                }
              }
            );
            // this.showToastMessage('Report has been submitted successfully!', 'success');
            // this.cancel();
          }
        }
      ]
    }).then(confirm => confirm.present());
  }
}
