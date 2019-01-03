import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ComponentsModule } from '../../components/components.module';
import { IconsultPage } from './iconsult';

@NgModule({
  declarations: [
    IconsultPage,
  ],
  imports: [
    IonicPageModule.forChild(IconsultPage),
    ComponentsModule,
  ],
})
export class IconsultPageModule { }
