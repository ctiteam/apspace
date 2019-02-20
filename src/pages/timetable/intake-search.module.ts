import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { IntakeListingProvider, TimetableProvider } from '../../providers';
import { IntakeSearchPage } from './intake-search';

@NgModule({
  declarations: [IntakeSearchPage],
  imports: [
    IonicPageModule.forChild(IntakeSearchPage),
  ],
  entryComponents: [IntakeSearchPage],
  providers: [IntakeListingProvider, TimetableProvider],
})
export class TimetablePageModule { }
