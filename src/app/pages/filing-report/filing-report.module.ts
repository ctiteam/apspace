import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { Camera } from '@ionic-native/camera/ngx';
import { IonicModule } from '@ionic/angular';
import { FilingReportPage } from './filing-report.page';




const routes: Routes = [
  {
    path: '',
    component: FilingReportPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [FilingReportPage],
  providers: [
    Camera
  ]
})
export class FilingReportPageModule { }
