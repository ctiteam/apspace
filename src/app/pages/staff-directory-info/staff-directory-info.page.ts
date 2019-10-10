import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Observable } from 'rxjs';
import { map, share } from 'rxjs/operators';

import { StaffDirectory } from '../../interfaces';
import { WsApiService, AppLauncherService } from '../../services';

/**
 * Display staff information. Can also be used as model.
 */
@Component({
  selector: 'app-staff-directory-info',
  templateUrl: './staff-directory-info.page.html',
  styleUrls: ['./staff-directory-info.page.scss'],
})

export class StaffDirectoryInfoPage implements OnInit {

  staff$: Observable<StaffDirectory>;
  staffExists = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ws: WsApiService,
    private appLauncherService: AppLauncherService
  ) { }

  ngOnInit() {
    const id = this.route.snapshot.params.id;
    this.staff$ = this.ws.get<StaffDirectory[]>('/staff/listing').pipe(
      map(ss => {
          const staffRecord = ss.find(s => s.ID === id);
          staffRecord ? this.staffExists = true : this.staffExists = false;
          return staffRecord;
        }),
      share(),
    );
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

  navigateToIconsult(staffId: string) {
    this.router.navigate(['staffs', staffId, 'consultations']);
  }

}
