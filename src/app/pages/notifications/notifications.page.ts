import { Component, OnInit } from '@angular/core';
import { Platform, ModalController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { NotificationService } from 'src/app/services';
import { map, tap, finalize } from 'rxjs/operators';
import { NotificationModalPage } from './notification-modal';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
})
export class NotificationsPage implements OnInit {
  cordova: boolean;
  messages$: Observable<any>;   // TYPE TO BE CHANGED AFTER DINGDONG TEAM FINISH THE BACKEND

  constructor(
    private platform: Platform,
    private notificationService: NotificationService,
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {
    if (this.platform.is('cordova')) {
      this.cordova = true;
    }
    this.doRefresh();
  }

  doRefresh(refresher?) {
    this.messages$ = this.notificationService.getMessages().pipe(
      map((res: { history: [] }) => res.history),
      tap(t => console.log(t)),
      finalize(() => refresher && refresher.target.complete()),
    );
  }

  async openModal(message: any) {
    const modal = await this.modalCtrl.create({
      component: NotificationModalPage,
      componentProps: { message, notFound: 'No Message Selected' },
    });
    await modal.present();
    await modal.onDidDismiss();
  }

}
