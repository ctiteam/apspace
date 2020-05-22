import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { DashboardCardComponent } from './dashboard-card/dashboard-card.component';
import { EventsListComponent } from './events-list/events-list.component';
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner';
import { MessageWithSvgComponent } from './message-with-svg/message-with-svg.component';
import { QuickAccessItemComponent } from './quick-access-item/quick-access-item.component';
import { SearchModalComponent } from './search-modal/search-modal.component';
import { StaysafeComponent } from './staysafe/staysafe.component';

@NgModule({
  declarations: [
    SearchModalComponent,
    LoadingSpinnerComponent,
    EventsListComponent,
    DashboardCardComponent,
    QuickAccessItemComponent,
    MessageWithSvgComponent,
    StaysafeComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
  ],
  exports: [
    SearchModalComponent,
    LoadingSpinnerComponent,
    EventsListComponent,
    DashboardCardComponent,
    QuickAccessItemComponent,
    MessageWithSvgComponent,
    StaysafeComponent
  ],
})
export class ComponentsModule { }
