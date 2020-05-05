import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { AlertController, ModalController } from '@ionic/angular';
import { OrientationStudentDetails, Role, StaffDirectory, StaffProfile, StudentPhoto, StudentProfile } from '../../interfaces';
import { SettingsService, WsApiService } from '../../services';
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

  async change(itemToChange: 'Email' | 'Mobile Number' | 'Religion' | 'Address', value: string) {
    const alert = await this.alertCtrl.create({
      header: `Updating My ${itemToChange}`,
      message: 'Please enter the new value:',
      inputs: [
        {
          name: 'newValue',
          value,
          type: itemToChange === 'Email' ? 'email' : itemToChange === 'Mobile Number' ? 'tel' : 'text',
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
          handler: () => {
            // to check for null values, and to check for exact similar value
            // to ask for limit of characters
            console.log('Confirm Ok');
          }
        }
      ]
    });

    await alert.present();
  }

  async requestChange() {
    const modal = await this.modalCtrl.create({
      component: RequestChangeModalPage,
      cssClass: 'generateTransactionsPdf',
      componentProps: {
        // classTypes: this.classTypes,
        // classCodes: filteredClassCodes
      }
    });
    await modal.present();
    await modal.onDidDismiss().then(data => {
      if (data.data) {
        // this.classcode = data.data.code;
        // this.classType = data.data.type;
      }
    });
  }

}
