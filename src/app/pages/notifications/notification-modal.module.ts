import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { SharedPipesModule } from 'src/app/shared/shared-pipes.module';
import { NotificationModalPage } from './notification-modal';

@NgModule({
  declarations: [NotificationModalPage],
  imports: [
    CommonModule,
    IonicModule,
    SharedPipesModule
  ],
})
export class NotificationModalModule { }
