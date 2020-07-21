import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { IonicModule } from '@ionic/angular';
import { ComponentsModule } from 'src/app/components/components.module';
import { SharedPipesModule } from '../../shared/shared-pipes.module';
import { ByGroupPipe } from './by-group.pipe';
import { ByItemPipe } from './by-item.pipe';
import { ItemInFavPipe } from './item-in-fav.pipe';
import { MorePage } from './more.page';



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
    RouterModule.forChild(routes),
    SharedPipesModule,
    ComponentsModule
  ],
  providers: [
    InAppBrowser
  ],
  declarations: [MorePage, ByGroupPipe, ItemInFavPipe, ByItemPipe]
})
export class MorePageModule { }
