import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { ComponentsModule } from 'src/app/components/components.module';
import { DingdongPreferencesPage } from './dingdong-preferences.page';

@NgModule({
  imports: [
    CommonModule,
    ComponentsModule,
    FormsModule,
    IonicModule
  ],
  declarations: [DingdongPreferencesPage]
})
export class DingdongPreferencesPageModule {}
