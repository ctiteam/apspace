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
        path: 'attendance',
        loadChildren: () => import('../attendance/attendance.module').then(m => m.AttendancePageModule)
      },
      {
        path: 'apcard',
<<<<<<< HEAD
        loadChildren: '../apcard/apcard.module#ApcardPageModule'
      },
      {
        path: 'more',
        loadChildren: '../more/more.module#MorePageModule'
      }
=======
        loadChildren: () => import('../apcard/apcard.module').then(m => m.ApcardPageModule)
      },
      {
        path: 'more',
        loadChildren: () => import('../more/more.module').then(m => m.MorePageModule)
      },
      {
        path: '',
        redirectTo: 'student-dashboard',
        pathMatch: 'full'
      },
>>>>>>> origin/v4
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule { }
