import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from '../../guards/auth.guard';
import { Role } from '../../interfaces';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'student-dashboard',
        canActivate: [AuthGuard],
        data: { role: Role.Student },
        loadChildren: () => import('../student-dashboard/student-dashboard.module').then(m => m.StudentDashboardPageModule)
      },
      {
        canActivate: [AuthGuard],
        data: { role: Role.Student },
        path: 'student-timetable',
        loadChildren: () => import('../student-timetable/student-timetable.module').then(m => m.StudentTimetablePageModule)
      },
      {
        canActivate: [AuthGuard],
        data: { role: Role.Lecturer },
        path: 'lecturer-timetable',
        loadChildren: () => import('../lecturer-timetable/lecturer-timetable.module').then(m => m.LecturerTimetablePageModule)
      },
      {
        canActivate: [AuthGuard],
        data: { role: Role.Student },
        path: 'attendance',
        loadChildren: () => import('../attendance/attendance.module').then(m => m.AttendancePageModule)
      },
      {
        canActivate: [AuthGuard],
        data: { role: Role.Lecturer },
        path: 'bus-shuttle-services',
        loadChildren: () => import('../bus-shuttle-services/bus-shuttle-services.module').then(m => m.BusShuttleServicesPageModule)
      },
      {
        canActivate: [AuthGuard],
        // tslint:disable-next-line:no-bitwise
        data: { role: Role.Lecturer | Role.Admin },
        path: 'profile',
        loadChildren: () => import('../profile/profile.module').then(m => m.ProfilePageModule)
      },
      {
        path: 'apcard',
        loadChildren: () => import('../apcard/apcard.module').then(m => m.ApcardPageModule)
      },
      {
        path: 'more',
        loadChildren: () => import('../more/more.module').then(m => m.MorePageModule)
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule { }
