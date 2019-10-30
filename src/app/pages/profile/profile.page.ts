import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { Role, StaffProfile, StudentPhoto, StudentProfile } from '../../interfaces';
import { SettingsService, WsApiService } from '../../services';

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
  skeltons = [
    80,
    30,
    100,
    45,
    60,
    76
  ];

  local = false;
  studentRole = false;
  countryName: string;
  constructor(
    private ws: WsApiService,
    private settings: SettingsService,
    private router: Router,
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
          this.profile$ = this.ws.get<StudentProfile>('/student/profile');
          this.getProfile();
          // tslint:disable-next-line:no-bitwise
        } else if (role & (Role.Lecturer | Role.Admin)) {
          this.staffProfile$ = this.ws.get<StaffProfile[]>('/staff/profile');
        }
        this.getProfile();
      });
      this.indecitor = false;
    }
  }

  openStaffDirectoryInfo(id: string) {
    this.router.navigate(['/staffs', id]);
  }

  getProfile() {
    const role = this.settings.get('role');
    // tslint:disable-next-line:no-bitwise
    if (role & Role.Student) {
      this.ws.get<StudentProfile>('/student/profile', { caching: 'cache-only' }).pipe(
        tap(p => {
          this.countryName = p.COUNTRY;
          if (p.COUNTRY === 'Malaysia') {
            this.local = true;
          } else {
            this.local = false;
            this.visa$ = this.getVisaStatus();
          }
        }),
      ).subscribe();
    } else {
      this.ws.get<StaffProfile[]>('/staff/profile', { caching: 'cache-only' }).pipe(
        tap(p => {
          this.countryName = p[0].NATIONALITY;
        }),
      ).subscribe();
    }
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
}
