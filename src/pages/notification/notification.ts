import { Component } from '@angular/core';
import { App, IonicPage, NavParams, Platform, MenuController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { finalize, map, tap } from 'rxjs/operators';

import { NotificationProvider } from '../../providers';

import * as _ from 'lodash';


@IonicPage()
@Component({
  selector: 'page-notification',
  templateUrl: 'notification.html',
})

export class NotificationPage {
  objectKeys = Object.keys;
  notifications = 'unread';
  unreadMessages: any;

  notificationCategory: string = '';
  notificationTitle: string = '';
  notificationSender: string = '';
  categories: string[];

  message$: Observable<any>;
  filteredMessage$: Observable<any>;

  numOfSkeletons = new Array(5);
  isLoading: boolean;
  cordova: boolean;

  constructor(
    private navParams: NavParams,
    private notification: NotificationProvider,
    private platform: Platform,
    public menu: MenuController,
    public app: App,
  ) { }

  ionViewDidEnter() {
    if (this.platform.is('cordova')) {
      this.doRefresh();
    }
  }

  ionViewDidLeave() {
    if (this.platform.is('cordova')) {
      const callback = this.navParams.get('callback');
      if (callback) {
        callback();
      }
    }
  }

  doRefresh(refresher?) {
    this.cordova = true;
    this.isLoading = true;
    this.getMessageForFirstTime();
  }

  getMessageForFirstTime(refresher?){
    this.message$ = this.notification.getMessage().pipe(
      map(res => res.history),
      tap(history => this.objectKeys(history).forEach(category => this.categories.push(category))),
      finalize(() => { refresher && refresher.complete(), this.isLoading = false; }),
    );
    this.onFilter();
  }

  // TOGGLE THE MENU
  toggleFilterMenu() {
    this.menu.toggle();
  }

  onFilter(){
    this.filteredMessage$ = this.message$.pipe(
      map(
        (history) => {
          return _.filter(this.objectKeys(history), category => {
            // FILTER NOTIFICATIONS BY CATEGORY
            return category.includes(this.notificationCategory);
          });
        }
      ),
      map(
        (history) => {
          return _.filter(this.objectKeys(history)['items'], notification => {
            // FILTER NOTIFICATIONS BY SENDER AND TITLE
            return notification['staff_name'].toLowerCase().includes(this.notificationSender.toLowerCase()) && notification['title'].toLowerCase().includes(this.notificationTitle.toLowerCase());
          });
        }
      ),
    ); 
  }

  showHistory(){
    this.notifications === 'all' ? this.notifications = 'unread' : this.notifications = 'all';
    this.toggleFilterMenu();
  }

  openBasicModal(item: any, messageID: string, category: string, firstColor: string, secondColor: string) {
    this.notification.sendRead(messageID).subscribe();
    this.app.getRootNav().push('NotificationModalPage', { itemDetails: item, category: category, firstColor: firstColor, secondColor: secondColor });
  }

  displayDate(msgId) {
    const date = this.notification.timeConverter(msgId);
    return date[0];
  }
}
