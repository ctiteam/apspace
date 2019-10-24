import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MenuController, ModalController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';
import { NotificationHistory } from 'src/app/interfaces';
import { NotificationService } from 'src/app/services';
import { NotificationModalPage } from './notification-modal';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
})
export class NotificationsPage {
  messages$: Observable<NotificationHistory>;
  categories = [];
  allCategories = {};
  skeletons = new Array(3);
  openedMessages = [];
  filterObject = {
    categories: [],
    upcoming: false
  };

  constructor(
    private notificationService: NotificationService,
    private modalCtrl: ModalController,
    private menu: MenuController,
    public sanitizer: DomSanitizer
  ) { }

  ionViewDidEnter() {
    this.doRefresh();
  }

  doRefresh(refresher?) {
    this.categories = [];
    this.filterObject.categories = [];
    this.messages$ = this.notificationService.getMessages().pipe(
      tap(res => res.history.forEach((history) => {
        if (this.categories.indexOf(history.category) <= -1) {
          this.categories.push(history.category);
          this.filterObject.categories.push(history.category);
        }
      })),
      finalize(() => refresher && refresher.target.complete()),
    );

    this.notificationService.getCategories().pipe(
      tap((categoriesRes: { categories: [] }) => this.allCategories = categoriesRes.categories)
    ).subscribe();
  }

  openMenu() {
    this.menu.enable(true, 'notifications-filter-menu');
    this.menu.open('notifications-filter-menu');
  }

  closeMenu() {
    this.menu.close('notifications-filter-menu');
  }

  getCategoryColor(categoryName: string) {
    let color = '';
    Object.keys(this.allCategories).forEach(key => {
      if (key === categoryName) {
        color = `linear-gradient(90deg, ${this.allCategories[key].first_colour} 0%, ${this.allCategories[key].second_colour} 100%)`;
      }
    });

    return color ? color : '#3880ff'; // defaul color
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
