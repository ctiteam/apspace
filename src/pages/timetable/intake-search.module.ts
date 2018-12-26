import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { TimetableProvider } from '../../providers';
import { IntakeSearchPage } from './intake-search';

@NgModule({
  declarations: [IntakeSearchPage],
  imports: [
    IonicPageModule.forChild(IntakeSearchPage),
  ],
  entryComponents: [IntakeSearchPage],
  providers: [TimetableProvider],
})
export class TimetablePageModule { }
