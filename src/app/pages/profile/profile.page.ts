import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { AlertController, ModalController, ToastController } from '@ionic/angular';
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
  visa$: Observable<any>;
  indecitor = false;
  skeltons = [80, 30, 100, 45, 60, 76];
  intakeModified = false;
  timetableAndExamScheduleIntake = '';
  local = true; // Set the initial value to true so the Visa status does not flash
  studentRole = false;
  countryName: string;
  orientationStudentDetails$: Observable<OrientationStudentDetails>;
  showOrientationProfile = false;
  councelorProfile$: Observable<StaffDirectory>;

  constructor(
    private alertCtrl: AlertController,
    private modalCtrl: ModalController,
    private router: Router,
    private settings: SettingsService,
    private ws: WsApiService,
    private appLauncherService: AppLauncherService,
    private toastCtrl: ToastController
  ) {
  }

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
              // to add condition here after upadting the profile api
              this.showOrientationProfile = true;
              this.orientationStudentDetails$ = this.ws.get<OrientationStudentDetails>(`orientation/student_details?id=${p.STUDENT_NUMBER}`,
                { url: 'https://gv8ap4lfw5.execute-api.ap-southeast-1.amazonaws.com/dev/' }
              ).pipe(
                tap(studentOrientationDetails => {
                  if (studentOrientationDetails.councelor_details.length > 0) {
                    this.councelorProfile$ = this.ws.get<StaffDirectory[]>('/staff/listing', { caching: 'cache-only' }).pipe(
                      map(res =>
                        res.find(staff =>
                          staff.ID.toLowerCase() === studentOrientationDetails.councelor_details[0].SAMACCOUNTNAME.toLowerCase()
                        )
                      )
                    );
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
  async change(itemToChange: 'STUDENT_EMAIL' | 'STUDENT_MOBILE_NO' | 'RELIGION' | 'STUDENT_RESIDENTIAL_ADDRESS', value: string, studentID: string) {
    const alert = await this.alertCtrl.create({
      header: `Updating My ${itemToChange}`,
      message: 'Please enter the new value:',
      inputs: [
        {
          name: 'newValue',
          value,
          type: itemToChange === 'STUDENT_EMAIL' ? 'email' : itemToChange === 'STUDENT_MOBILE_NO' ? 'tel' : 'text',
          placeholder: `New ${itemToChange} Value`
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
              const body = {};
              body[itemToChange] = data.newValue;
              this.ws.post(`orientation/update_profile?id=${studentID}`,
                {
                  url: 'https://gv8ap4lfw5.execute-api.ap-southeast-1.amazonaws.com/dev/',
                  body
                }
              ).subscribe(
                _ => this.showToastMessage(`${itemToChange} Has Been Updated Successfully!`, 'success'),
                err => this.showToastMessage(`Error: ${err}`, 'danger'),
                () => {
                  this.indecitor = true;
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
      componentProps: {orientationProfile}
    });
    await modal.present();
    await modal.onDidDismiss();
  }

  chatInTeams(lecturerCasId: string) {
    const androidSchemeUrl = 'com.microsoft.teams';
    const iosSchemeUrl = 'microsoft-teams://';
    const webUrl = `https://teams.microsoft.com/_#/apps/a2da8768-95d5-419e-9441-3b539865b118/search?q=?${lecturerCasId}`;
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

}
