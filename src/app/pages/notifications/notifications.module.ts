import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ComponentsModule } from 'src/app/components/components.module';
import { SharedPipesModule } from 'src/app/shared/shared-pipes.module';
import { DingdongPreferencesPageModule } from '../settings/dingdong-preferences/dingdong-preferences.module';
import { DingdongPreferencesPage } from '../settings/dingdong-preferences/dingdong-preferences.page';
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
  entryComponents: [DingdongPreferencesPage],
  imports: [
    CommonModule,
    ComponentsModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    SharedPipesModule,
    DingdongPreferencesPageModule
  ],
  declarations: [NotificationsPage, UnreadMessagesOnlyPipe, NotificationCategoryPipe],
})
export class NotificationsPageModule { }
