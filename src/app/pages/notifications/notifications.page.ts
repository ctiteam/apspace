import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { NotificationService } from 'src/app/services';
import { map, finalize, tap } from 'rxjs/operators';
import { NotificationModalPage } from './notification-modal';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
})
export class NotificationsPage implements OnInit {
  messages$: Observable<any>;   // TYPE TO BE CHANGED AFTER DINGDONG TEAM FINISH THE BACKEND
  skeletons = new Array(3);
  openedMessages = [];
  constructor(
    private notificationService: NotificationService,
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {
    this.doRefresh();
  }

  doRefresh(refresher?) {
    this.messages$ = this.notificationService.getMessages().pipe(
      map((res: { history: [] }) => res.history),
      finalize(() => refresher && refresher.target.complete()),
    );
  }

  async openModal(message: any) {
    const modal = await this.modalCtrl.create({
      component: NotificationModalPage,
      componentProps: { message, notFound: 'No Message Selected' },
    });
    this.openedMessages.push(message.message_id);
    this.notificationService.sendRead(message.message_id).subscribe();
    await modal.present();
    await modal.onDidDismiss();
  }

}
