import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { IonicModule } from '@ionic/angular';
import { SharedPipesModule } from '../../shared/shared-pipes.module';
import { ByGroupPipe } from './by-group.pipe';
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
    SharedPipesModule
  ],
  providers: [
    InAppBrowser
  ],
  declarations: [MorePage, ByGroupPipe, ItemInFavPipe]
})
export class MorePageModule { }
