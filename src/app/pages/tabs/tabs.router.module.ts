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
        loadChildren: () => import('../student-dashboard/student-dashboard.module').then(m => m.StudentDashboardPageModule)
      },
      {
        path: 'student-timetable',
        loadChildren: () => import('../student-timetable/student-timetable.module').then(m => m.StudentTimetablePageModule)
      },
      {
        path: '',
        redirectTo: 'student-dashboard',
        pathMatch: 'full'
      },
      {
        path: 'attendance',
        loadChildren: () => import('../attendance/attendance.module').then(m => m.AttendancePageModule)
      },
      {
        path: 'apcard',
        loadChildren: () => import('../apcard/apcard.module').then(m => m.ApcardPageModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule { }
