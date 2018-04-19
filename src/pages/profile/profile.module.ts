import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { ProfilePage } from './profile';

@NgModule({
  declarations: [ProfilePage],
  imports: [
    IonicPageModule.forChild(ProfilePage),
  ],
  entryComponents: [ProfilePage]
})
export class ProfilePageModule {}
