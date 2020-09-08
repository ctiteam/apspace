import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { SharedPipesModule } from '../../shared/shared-pipes.module';
import { ByGroupPipe } from './by-group.pipe';
import { TabsPage } from './tabs.page';
import { TabsPageRoutingModule } from './tabs.router.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    TabsPageRoutingModule,
    SharedPipesModule,
  ],
  declarations: [TabsPage, ByGroupPipe]
})
export class TabsPageModule { }
