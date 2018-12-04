import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { TimetableProvider } from '../../providers';
import { ClassroomFinderPage } from './classroom-finder';

@NgModule({
  declarations: [ClassroomFinderPage],
  providers: [
    TimetableProvider,
  ],
  imports: [
    IonicPageModule.forChild(ClassroomFinderPage),
  ],
})
export class ClassroomFinderPageModule {}
