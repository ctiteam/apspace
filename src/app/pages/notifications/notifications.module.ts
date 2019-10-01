import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { NotificationsPage } from './notifications.page';
import { NotificationModalPage } from './notification-modal';
import { ComponentsModule } from 'src/app/components/components.module';
import { ReversePipe } from './reverse.pipe';

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
  declarations: [NotificationsPage, NotificationModalPage, ReversePipe],
  entryComponents: [NotificationModalPage],

})
export class NotificationsPageModule {}
