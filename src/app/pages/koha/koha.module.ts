import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { ComponentsModule } from 'src/app/components/components.module';

import { IonicModule } from '@ionic/angular';


import { KohaPage } from './koha.page';

const routes: Routes = [
  {
    path: '',
    component: KohaPage
  }
];

@NgModule({
  imports: [

    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    ComponentsModule,
  ],
  declarations: [KohaPage]
})
export class KohaPageModule { }
