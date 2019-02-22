import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './guards/auth.guard';
import { DeauthGuard } from './guards/deauth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'tabs',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: './login/login.module#LoginPageModule',
    canActivate: [DeauthGuard]
  },
  {
    path: 'tabs',
    loadChildren: './tabs/tabs.module#TabsPageModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'student-timetable',
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        loadChildren: './student-timetable/student-timetable.module#StudentTimetablePageModule'
      }
    ]
  },
  {
    path: 'staffs',
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        loadChildren: './staff-directory/staff-directory.module#StaffDirectoryPageModule'
      }
    ]
  },
  { path: 'staff', loadChildren: './staff-directory-info/staff-directory-info.module#StaffDirectoryInfoPageModule' },
  {
    path: 'attendix-lecturer',
    // canActivate: [AuthGuard],
    children: [
      { path: 'classes', loadChildren: './attendix-lecturer/classes/classes.module#ClassesPageModule' },
      { path: 'take-attendance', loadChildren: './attendix-lecturer/take-attendance/take-attendance.module#TakeAttendancePageModule' },
      // { path: 'qr-otp', loadChildren: './qr-otp/qr-otp.module#QrOtpPageModule' },
      // { path: 'take-picture', loadChildren: './take-picture/take-picture.module#TakePicturePageModule' },
    ]
  },
  {
    path: 'feedback',
    loadChildren: './feedback/feedback.module#FeedbackPageModule'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
