import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicPageModule } from 'ionic-angular';
import { PasswordRecoveryPage } from './password-recovery';

import { SqaProvider } from '../../providers';

@NgModule({
  declarations: [
    PasswordRecoveryPage,
  ],
  imports: [
    IonicPageModule.forChild(PasswordRecoveryPage),
    FormsModule,
  ],
  entryComponents: [PasswordRecoveryPage],
  providers: [SqaProvider]
})
export class PasswordRecoveryPageModule { }
