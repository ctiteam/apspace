import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OrientatonStudentPortalPageRoutingModule } from './orientaton-student-portal-routing.module';

import { OrientatonStudentPortalPage } from './orientaton-student-portal.page';
import { ViewStudentProfileModalPage } from './view-student-profile/view-student-profile-modal';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OrientatonStudentPortalPageRoutingModule
  ],
  declarations: [OrientatonStudentPortalPage, ViewStudentProfileModalPage],
})
export class OrientatonStudentPortalPageModule {}
