import { Component, OnInit, NgZone, } from '@angular/core';
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

  local = false;
  studentRole = false;
  countryName: string;
  countryType: string;
  constructor(
    private ws: WsApiService,
    private settings: SettingsService,
    private router: Router,
  ) {
  }

  ngOnInit() {
    this.settings.ready().then(() => {
      const role = this.settings.get('role');
      // tslint:disable-next-line:no-bitwise
      if (role & Role.Student) {
        this.studentRole = true;
        this.photo$ = this.ws.get<StudentPhoto>('/student/photo', true);
        this.profile$ = this.ws.get<StudentProfile>('/student/profile', true);
        this.getProfile();
        // tslint:disable-next-line:no-bitwise
      } else if (role & (Role.Lecturer | Role.Admin)) {
        this.staffProfile$ = this.ws.get<StaffProfile[]>('/staff/profile', true);
      }
      this.getProfile();
    });
  }

  openStaffDirectoryInfo(id: string) {
    this.router.navigate(['/staffs', id]);
  }

  getProfile() {
    const role = this.settings.get('role');
    // tslint:disable-next-line:no-bitwise
    if (role & Role.Student) {
      this.ws.get<StudentProfile>('/student/profile').pipe(
        tap(p => {
          this.countryName = p.COUNTRY;
          this.countryType = 'country';
          if (p.COUNTRY === 'Malaysia') {
            this.local = true;
          } else {
            this.local = false;
            this.visa$ = this.getVisaStatus();
          }
        }),
      ).subscribe();
    } else {
      this.ws.get<StaffProfile[]>('/staff/profile').pipe(
        tap(p => {
          this.countryName = p[0].NATIONALITY;
          this.countryType = 'nationality';
        }),
      ).subscribe();
    }
  }

  getVisaStatus() {
    return this.ws.get<any>('/student/visa_status');
  }
}
