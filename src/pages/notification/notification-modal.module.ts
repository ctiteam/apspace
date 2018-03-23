import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NotificationModalPage } from './notification-modal';

@NgModule({
  declarations: [
    NotificationModalPage,
  ],
  imports: [
    IonicPageModule.forChild(NotificationModalPage),
  ],
})
export class NotificationModalPageModule {}
