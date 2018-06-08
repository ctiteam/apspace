import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { ProgressBarModule } from 'angular-progress-bar';
import { ParallaxHeaderDirective } from '../../directives/parallax-header/parallax-header';

import { AttendancePage } from './attendance';

@NgModule({
  declarations: [AttendancePage, ParallaxHeaderDirective],
  imports: [
    IonicPageModule.forChild(AttendancePage),
    NgCircleProgressModule.forRoot(),
    ProgressBarModule
  ],
  entryComponents: [AttendancePage]
})
export class AttendancePageModule { }
