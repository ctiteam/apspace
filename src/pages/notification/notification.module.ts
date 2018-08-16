import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NotificationPage } from './notification';
import { UnreadPipe } from '../notification/unread.pipe';

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
