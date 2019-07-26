import { NgModule } from '@angular/core';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { MorePage } from './more.page';
import { FusePipe } from './fuse.pipe';

const routes: Routes = [
  {
    path: '',
    component: MorePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  providers: [
    InAppBrowser
  ],
  declarations: [MorePage, FusePipe]
})
export class MorePageModule { }
