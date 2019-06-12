import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'student-dashboard',
        loadChildren: '../student-dashboard/student-dashboard.module#StudentDashboardPageModule'
      },
      {
        path: 'student-timetable',
        loadChildren: '../student-timetable/student-timetable.module#StudentTimetablePageModule'
      },
      {
        path: '',
        redirectTo: 'student-dashboard',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
