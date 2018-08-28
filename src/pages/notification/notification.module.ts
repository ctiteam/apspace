import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UnreadPipe } from '../notification/unread.pipe';
import { NotificationPage } from './notification';

@NgModule({
  declarations: [
    NotificationPage,
    UnreadPipe,
  ],
  imports: [
    IonicPageModule.forChild(NotificationPage),
  ],

})
export class NotificationPageModule { }
