import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ConsultationHour, SlotDetails } from 'src/app/interfaces';
import { WsApiService, AppLauncherService } from 'src/app/services';
import { SlotDetailsModalPage } from './slot-details-modal';

@Component({
  selector: 'app-my-appointments',
  templateUrl: './my-appointments.page.html',
  styleUrls: ['./my-appointments.page.scss'],
})
export class MyAppointmentsPage implements OnInit {
  slots$: Observable<ConsultationHour[]>;
  slotDetails$: Observable<SlotDetails>;

  skeltonArray = new Array(4);

  constructor(
    private modalCtrl: ModalController,
    private router: Router,
    private ws: WsApiService,
    private appLauncherService: AppLauncherService
  ) { }

  ngOnInit() {
    this.slots$ = this.getSlots();
  }

  getSlots() {
    return this.ws.get<ConsultationHour[]>('/iconsult/upcomingconstu', true).pipe(
    );
  }

  getSlotDetails(slotId: string) {
    this.slotDetails$ = this.ws.get<SlotDetails>(`/iconsult/detailpageconstu/${slotId}`, true).pipe(
      map(response => response[0]),
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

  openStaffDirectory() {
    this.router.navigateByUrl('staffs', { replaceUrl: false });
  }

  async openSlotDetailsModal(slotId: string) {
    const modal = await this.modalCtrl.create({
      component: SlotDetailsModalPage,
      cssClass: 'add-min-height',
      componentProps: { slotId, notFound: 'No slot Selected' },
    });
    await modal.present();
    await modal.onDidDismiss();
  }

}
