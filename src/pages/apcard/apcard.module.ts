import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { ApcardPage } from './apcard';
import { EntryPipe } from './entry.pipe';

@NgModule({
  declarations: [ApcardPage, EntryPipe],
  imports: [
    IonicPageModule.forChild(ApcardPage),
  ],
  entryComponents: [ApcardPage]
})
export class ApcardPageModule { }
