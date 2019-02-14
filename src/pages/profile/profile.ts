import { Component, ElementRef } from '@angular/core';
import { App, IonicPage } from 'ionic-angular';

import { Observable } from 'rxjs/Observable';
import { map, switchMap, tap } from 'rxjs/operators';

import { Role, StaffDirectory, StaffProfile, StudentPhoto, StudentProfile } from '../../interfaces';
import { AppAnimationProvider, SettingsProvider, WsApiProvider } from '../../providers';

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  photo$: Observable<StudentPhoto[]>;
  profile$: Observable<StudentProfile>;
  mentorLink$: Observable<string>;
  staffProfile$: Observable<StaffProfile[]>;
  visa$: Observable<any>;

  local: boolean = false;

  constructor(
    private ws: WsApiProvider,
    private settings: SettingsProvider,
    private appAnimationProvider: AppAnimationProvider,
    private elRef: ElementRef,
    private app: App,
  ) { }

  ionViewDidLoad() {
    this.appAnimationProvider.addAnimationsToSections(this.elRef);
    const role = this.settings.get('role');
    if (role & Role.Student) {
      this.photo$ = this.ws.get<StudentPhoto[]>('/student/photo', true);
      this.profile$ = this.ws.get<StudentProfile>('/student/profile', true);
      this.mentorLink$ = this.profile$.pipe(
        // TODO: switch back to sam account name if implemented
        switchMap(p => this.ws.get<StaffDirectory[]>('/staff/listing').pipe(
          map(ss => ss.find(s => s.CODE === p.MENTOR_PROGRAMME_LEADER)),
        )),
        map(s => (s || {} as StaffDirectory).ID),
      );
      this.getProfile();
    } else if (role & (Role.Lecturer | Role.Admin)) {
      this.staffProfile$ = this.ws.get<StaffProfile[]>('/staff/profile', true);
    }
  }

  openStaffDirectoryInfo(id: string) {
    this.app.getRootNav().push('StaffDirectoryInfoPage', { id });
  }

  getProfile() {
    this.ws.get<StudentProfile>('/student/profile').pipe(
      tap(p => {
        if (p.COUNTRY === 'Malaysia') {
          this.local = true;
        } else {
          this.local = false;
          this.visa$ = this.getVisaStatus();
        }
      }),
    ).subscribe();
  }

  getVisaStatus() {
    return this.ws.get<any>('/student/visa_status');
  }

}
