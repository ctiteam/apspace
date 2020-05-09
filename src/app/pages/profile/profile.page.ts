import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { AlertController, LoadingController, ModalController, ToastController } from '@ionic/angular';
import { OrientationStudentDetails, Role, StaffDirectory, StaffProfile, StudentPhoto, StudentProfile } from '../../interfaces';
import { AppLauncherService, SettingsService, WsApiService } from '../../services';
import { RequestChangeModalPage } from './request-update-modal/request-update-modal';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  photo$: Observable<StudentPhoto>;
  profile$: Observable<StudentProfile>;
  staffProfile$: Observable<StaffProfile[]>;
  councelorProfile$: Observable<StaffDirectory>;
  orientationStudentDetails$: Observable<OrientationStudentDetails>;
  visa$: Observable<any>;

  indecitor = false;
  skeltons = [80, 30, 100, 45, 60, 76];
  intakeModified = false;
  timetableAndExamScheduleIntake = '';
  local = true; // Set the initial value to true so the Visa status does not flash
  studentRole = false;
  countryName: string;
  showOrientationProfile = false;
  file: File;
  loading: HTMLIonLoadingElement;

  constructor(
    private alertCtrl: AlertController,
    private modalCtrl: ModalController,
    private router: Router,
    private settings: SettingsService,
    private ws: WsApiService,
    private appLauncherService: AppLauncherService,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController
  ) { }

  ngOnInit() {
    this.indecitor = true;
  }

  ionViewDidEnter() {
    /*
    * The page's response is very huge, which is causing issues on ios if we use oninit
    * the indecitor is used to define if the page should call the dorefresh of not
    * If we do not use the indecitor, the page in the tabs (tabs/attendance) will be reloading every time we enter the tab
    */
    this.getProfile();
  }

  getProfile() {
    if (this.indecitor) {
      this.settings.ready().then(() => {
        const role = this.settings.get('role');
        // tslint:disable-next-line:no-bitwise
        if (role & Role.Student) {
          this.studentRole = true;
          this.photo$ = this.ws.get<StudentPhoto>('/student/photo');
          this.profile$ = this.ws.get<StudentProfile>('/student/profile').pipe(
            map(studentProfile => {
              // AP & BP Removed Temp (Requested by Management | DON'T TOUCH)
              if (studentProfile.INTAKE.includes('(AP)') || studentProfile.INTAKE.includes('(BP)')) {
                this.intakeModified = true;
                this.timetableAndExamScheduleIntake = studentProfile.INTAKE.replace(/[(]AP[)]|[(]BP[)]/g, '');
              }
              return studentProfile;
            }),
            tap(p => {
              this.showOrientationProfile = true;
              this.orientationStudentDetails$ = this.ws.get<OrientationStudentDetails>(
                `/orientation/student_details?id=${p.STUDENT_NUMBER}`).pipe(
                  catchError(err => {
                    // api returns 401 when student should not access this orientation form
                    this.showOrientationProfile = false;
                    return of(err);
                  }),
                  tap(studentOrientationDetails => {
                    if (studentOrientationDetails.councelor_details.length > 0) {
                      this.councelorProfile$ = this.ws.get<StaffDirectory[]>('/staff/listing', { caching: 'cache-only' }).pipe(
                        map(res =>
                          res.find(staff =>
                            staff.ID.toLowerCase() === studentOrientationDetails.councelor_details[0].SAMACCOUNTNAME.toLowerCase()
                          )
                        )
                      );
                    } else {
                      this.showOrientationProfile = false;
                    }
                  })
                );
            }),
            tap(p => {
              this.countryName = p.COUNTRY;
              if (p.COUNTRY === 'Malaysia') {
                this.local = true;
              } else {
                this.local = false;
                this.visa$ = this.getVisaStatus();
              }
            }),
          );
          // tslint:disable-next-line:no-bitwise
        } else if (role & (Role.Lecturer | Role.Admin)) {
          this.staffProfile$ = this.ws.get<StaffProfile[]>('/staff/profile');
        }
      });
      this.indecitor = false;
    }
  }

  openStaffDirectoryInfo(id: string) {
    this.router.navigate(['/staffs', id]);
  }

  getVisaStatus() {
    return this.ws.get<any>('/student/visa_status', { caching: 'cache-only' });
  }

  comingFromTabs() {
    if (this.router.url.split('/')[1].split('/')[0] === 'tabs') {
      return true;
    }
    return false;

  }

  // tslint:disable-next-line: max-line-length
  async change(itemToChange: 'STUDENT_EMAIL' | 'STUDENT_MOBILE_NO' | 'RELIGION' | 'STUDENT_PERMANENT_ADDRESS', value: string, studentID: string) {
    const alert = await this.alertCtrl.create({
      header: `UPDATE ${itemToChange.replace(/_/g, ' ')}`,
      message: 'Please enter the new value:',
      inputs: [
        {
          name: 'newValue',
          value,
          type: itemToChange === 'STUDENT_EMAIL' ? 'email' : itemToChange === 'STUDENT_MOBILE_NO' ? 'tel' : 'text',
          placeholder: `NEW ${itemToChange.replace(/_/g, ' ')} VALUE`
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary-txt-color',
          handler: () => { }
        }, {
          text: 'Update',
          handler: (data) => {
            if (!data.newValue) {
              this.showToastMessage('New Value Cannot Be Empty!!', 'danger');
            } else {
              this.presentLoading();
              const body = {};
              body[itemToChange] = data.newValue;
              this.ws.post(`/orientation/update_profile?id=${studentID}`,
                { body }
              ).subscribe(
                _ => this.showToastMessage(`${itemToChange} Has Been Updated Successfully!`, 'success'),
                err => {
                  this.showToastMessage(`Error: ${err.error.errors[0].message}`, 'danger');
                  this.dismissLoading();
                },
                () => {
                  this.indecitor = true;
                  this.dismissLoading();
                  this.getProfile();
                }
              );
            }
          }
        }
      ]
    });

    await alert.present();
  }

  async requestChange(orientationProfile: OrientationStudentDetails) {
    const modal = await this.modalCtrl.create({
      component: RequestChangeModalPage,
      cssClass: 'generateTransactionsPdf',
      componentProps: { orientationProfile }
    });
    await modal.present();
    await modal.onDidDismiss();
  }

  chatInTeams(lecturerCasId: string) {
    const androidSchemeUrl = 'com.microsoft.teams';
    const iosSchemeUrl = 'microsoft-teams://';
    const webUrl = `https://teams.microsoft.com/l/chat/0/0?users=${lecturerCasId}@staffemail.apu.edu.my`;
    const appStoreUrl = 'https://itunes.apple.com/us/app/microsoft-teams/id1113153706?mt=8';
    const appViewUrl = 'https://teams.microsoft.com/l/chat/0/0?users=';
    // tslint:disable-next-line: max-line-length
    const playStoreUrl = `https://play.google.com/store/apps/details?id=com.microsoft.teams&hl=en&referrer=utm_source%3Dgoogle%26utm_medium%3Dorganic%26utm_term%3D'com.microsoft.teams'&pcampaignid=APPU_1_NtLTXJaHKYr9vASjs6WwAg`;
    this.appLauncherService.launchExternalApp(
      iosSchemeUrl,
      androidSchemeUrl,
      appViewUrl,
      webUrl,
      playStoreUrl,
      appStoreUrl,
      `${lecturerCasId}@staffemail.apu.edu.my`);
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

  changeListener($event): void {
    this.file = $event.target.files[0];
  }

  uploadDocument(STUDENT_NAME: string, COUNSELLOR_NAME: string, COUNSELLOR_EMAIL: string) {
    if (this.file.size > 1500000) {
      this.showToastMessage('Error: Maximum File Size is 1.5MB', 'danger');
    } else if (this.file.type === 'application/pdf' || this.file.type === 'image/jpeg' || this.file.type === 'image/png') {
      this.presentLoading();
      const reader = new FileReader();
      reader.readAsDataURL(this.file);
      reader.onload = () => {
        const body = { STUDENT_NAME, COUNSELLOR_EMAIL, COUNSELLOR_NAME, DOCUMENT: reader.result };
        this.ws.post<any>(`/orientation/profile_change_request`, {body}).subscribe(
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
