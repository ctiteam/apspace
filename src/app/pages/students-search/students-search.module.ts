import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { StudentsSearchPageRoutingModule } from './students-search-routing.module';
import { StudentsSearchPage } from './students-search.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StudentsSearchPageRoutingModule
  ],
  declarations: [StudentsSearchPage]
})
export class StudentsSearchPageModule {}
