import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Storage } from '@ionic/storage';

import { Observable } from 'rxjs';
import { share } from 'rxjs/operators';

import { Role, StaffDirectory } from '../../interfaces';
import { AppLauncherService, WsApiService } from '../../services';

/**
 * Display staff information. Can also be used as model.
 */
@Component({
  selector: 'app-staff-directory-info',
  templateUrl: './staff-directory-info.page.html',
  styleUrls: ['./staff-directory-info.page.scss'],
})

export class StaffDirectoryInfoPage implements OnInit {

  staffs$: Observable<StaffDirectory[]>;
  isStudent = false;
  id: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ws: WsApiService,
    private appLauncherService: AppLauncherService,
    private storage: Storage,
  ) {}

  ngOnInit() {
    this.id = this.route.snapshot.params.id;
    this.staffs$ = this.ws.get<StaffDirectory[]>('/staff/listing', { caching: 'cache-only' }).pipe(
      share(),
    );
    this.storage.get('role').then((role: Role) => {
      // tslint:disable-next-line: no-bitwise
      this.isStudent = Boolean(role & Role.Student);
    });
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

  navigateToIconsult(staffId: string) {
    this.router.navigate(['staffs', staffId, 'consultations']);
  }

}
