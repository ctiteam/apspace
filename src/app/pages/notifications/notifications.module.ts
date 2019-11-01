import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ComponentsModule } from 'src/app/components/components.module';
import { NotificationCategoryPipe } from './notification-category.pipe';
import { NotificationsPage } from './notifications.page';
import { UnreadMessagesOnlyPipe } from './unread-messages-only.pipe';

const routes: Routes = [
  {
    path: '',
    component: NotificationsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    ComponentsModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [NotificationsPage, UnreadMessagesOnlyPipe, NotificationCategoryPipe],
})
export class NotificationsPageModule { }
