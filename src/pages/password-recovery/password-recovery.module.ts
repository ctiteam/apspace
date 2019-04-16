import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicPageModule } from 'ionic-angular';
import { PasswordRecoveryPage } from './password-recovery';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    PasswordRecoveryPage,
  ],
  imports: [
    IonicPageModule.forChild(PasswordRecoveryPage),
    FormsModule,
    ComponentsModule,
  ],
  entryComponents: [PasswordRecoveryPage],
})
export class PasswordRecoveryPageModule { }
