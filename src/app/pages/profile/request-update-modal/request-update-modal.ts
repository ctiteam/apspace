import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { LoadingController, ModalController, ToastController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { OrientationStudentDetails, StudentPhoto } from 'src/app/interfaces';
import { WsApiService } from 'src/app/services';
@Component({
  selector: 'page-request-update-modal-modal',
  templateUrl: 'request-update-modal.html',
  styleUrls: ['request-update-modal.scss'],
  providers: [DatePipe]
})

export class RequestChangeModalPage implements OnInit {
  photo$: Observable<StudentPhoto>;
  updatedOrientationProfile: OrientationStudentDetails;
  loading: HTMLIonLoadingElement;
  file: File;

  /* input from profile page */
  orientationProfile: OrientationStudentDetails;

  constructor(
    private modalCtrl: ModalController,
    private toastCtrl: ToastController,
    private ws: WsApiService,
    private datePipe: DatePipe,
    private loadingCtrl: LoadingController
  ) { }

  ngOnInit() {
    // clone the object, the backend needs the new object and the old one
    this.updatedOrientationProfile = JSON.parse(JSON.stringify(this.orientationProfile));
    this.photo$ = this.ws.get<StudentPhoto>('/student/photo');
  }

  submit() {
    if (this.orientationProfile.councelor_details.length < 1) {
      this.showToastMessage('No E-Counsellor Has Been Assigned To You Yet! Please Contact The Admin Office.', 'danger');
    } else {
      // request body, COUNSELLOR_EMAIL, COUNSELLOR_NAME, STUDENT_NAME are always requried
      const body = {
        STUDENT_NAME: this.orientationProfile.student_details[0].STUDENT_NAME,
        COUNSELLOR_EMAIL: this.orientationProfile.councelor_details[0].EMAIL,
        COUNSELLOR_NAME: this.orientationProfile.councelor_details[0].COUNCELOR_NAME
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
      if (Object.keys(body).length <= 3) {
        // three items are required all the time student name, counsellor email and counsellor date
        this.showToastMessage('Nothing Has Been Changed In The Form, Request Cannot Be Submitted Without Any Changes.', 'danger');
      } else {
        this.presentLoading();
        // tslint:disable-next-line: no-string-literal
        if (body['NEW_DOB']) {
          // tslint:disable-next-line: no-string-literal
          body['NEW_DOB'] = this.datePipe.transform(body['NEW_DOB'], 'EEE, dd MMM yyy') + ' 00:00:00 GMT';
        }
        this.ws.post('/orientation/profile_change_request', { body }).subscribe(
          res => {
            console.log(res);
          },
          err => {
            this.dismissLoading();
            this.showToastMessage('Something Went Wrong From Our Side. Please Contact Your E-COUNSELLOR And Inform Him/Her About The Issue', 'danger');
            console.error('error ', err);
          },
          () => {
            this.dismissLoading();
            this.showToastMessage('Your Request Change Has Been Submitted Successfully. The Team Will Review Your Request Now.', 'success');
            this.dismiss();
          }
        );
      }
    }
  }

  changeListener($event): void {
    this.file = $event.target.files[0];
  }

  uploadDocument(STUDENT_NAME: string, COUNSELLOR_NAME: string, COUNSELLOR_EMAIL: string) {
    if (!this.file) {
      this.showToastMessage('Error: Fule Cannot Be Empty!', 'danger');
    } else {
      if (this.file.size > 1500000) {
        this.showToastMessage('Error: Maximum File Size is 1.5MB', 'danger');
      } else if (this.file.type === 'application/pdf' || this.file.type === 'image/jpeg' || this.file.type === 'image/png') {
        this.presentLoading();
        const reader = new FileReader();
        reader.readAsDataURL(this.file);
        reader.onload = () => {
          const body = { STUDENT_NAME, COUNSELLOR_EMAIL, COUNSELLOR_NAME, STUDENT_PHOTO: reader.result };
          this.ws.post<any>(`/orientation/profile_change_request`, { body }).subscribe(
            () => this.showToastMessage('Your Request Has Been Submitted Successfully. Your E-COUNSELLOR Will Review It And Get Back To You As Soon As Possible.', 'success'),
            () => {
              this.showToastMessage('Something Went Wrong From Our Side. Please Contact Your E-COUNSELLOR And Inform Him/Her About The Issue', 'danger');
              this.dismissLoading();
            },
            () => this.dismissLoading()
          );
        };
      } else {
        this.showToastMessage('Error: File Format is not supported. File Format Should Be Either .png, .jpeg, or .pdf', 'danger');
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

  async presentLoading() {
    this.loading = await this.loadingCtrl.create({
      spinner: 'dots',
      duration: 20000,
      message: 'Loading ...',
      translucent: true,
      animated: true
    });
    return await this.loading.present();
  }

  async dismissLoading() {
    if (this.loading) {
      return await this.loading.dismiss();
    }
  }
}
