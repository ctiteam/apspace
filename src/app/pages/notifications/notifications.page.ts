import { Component, OnInit } from '@angular/core';
import { ModalController, MenuController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { NotificationService } from 'src/app/services';
import { finalize, tap } from 'rxjs/operators';
import { NotificationModalPage } from './notification-modal';
import { NotificationHistory } from 'src/app/interfaces';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
})
export class NotificationsPage implements OnInit {
  messages$: Observable<NotificationHistory>;
  categories$: any;
  categories = [];
  skeletons = new Array(3);
  openedMessages = [];
  filterObject = {
    categories: [],
    upcoming: false
  };

  constructor(
    private notificationService: NotificationService,
    private modalCtrl: ModalController,
    private menu: MenuController
  ) { }

  ngOnInit() {
    this.doRefresh();
  }

  doRefresh(refresher?) {
    this.categories = [];
    // this.categories$ = this.notificationService.getCategories().pipe(
    // map(res => res['categories']),
    // tap(categories => this.categories = categories),
    // map(categories => {
    this.messages$ = this.notificationService.getMessages().pipe(
      tap(res => res.history.forEach((history) => {
        if (this.categories.indexOf(history.category) <= -1) {
          this.categories.push(history.category);
          this.filterObject.categories.push(history.category);
        }
      })),
      finalize(() => refresher && refresher.target.complete()),
    );

    // }),
    // ).subscribe();
  }

  openMenu() {
    this.menu.enable(true, 'notifications-filter-menu');
    this.menu.open('notifications-filter-menu');
  }

  closeMenu() {
    this.menu.close('notifications-filter-menu');
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
