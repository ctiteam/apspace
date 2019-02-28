import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { LoginPage } from './login';
import { InAppBrowser } from '@ionic-native/in-app-browser';

@NgModule({
  declarations: [LoginPage],
  imports: [
    IonicPageModule.forChild(LoginPage),
  ],
  entryComponents: [LoginPage],
  providers: [InAppBrowser],
})
export class LoginPageModule { }
