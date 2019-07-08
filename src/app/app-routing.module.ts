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
    loadChildren: './pages/login/login.module#LoginPageModule',
    canActivate: [DeauthGuard]
  },
  {
    path: 'tabs',
    loadChildren: './pages/tabs/tabs.module#TabsPageModule',
    canActivate: [AuthGuard]
  },

  {
    path: 'student-timetable',
    loadChildren: './pages/student-timetable/student-timetable.module#StudentTimetablePageModule'
  },
  {
    path: 'staffs',
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        loadChildren: './pages/staff-directory/staff-directory.module#StaffDirectoryPageModule'
      }
    ]
  },
  { path: 'staff', loadChildren: './pages/staff-directory-info/staff-directory-info.module#StaffDirectoryInfoPageModule' },
  {
    path: 'feedback',
    loadChildren: './pages/feedback/feedback.module#FeedbackPageModule'
  },
  {
    path: 'attendix-lecturer',
    // canActivate: [AuthGuard],
    children: [
      {
        path: 'classes',
        loadChildren:
          './pages/attendix/attendix-lecturer/classes/classes.module#ClassesPageModule'
      },
      {
        path: 'take-attendance',
        loadChildren:
          './pages/attendix/attendix-lecturer/take-attendance/take-attendance.module#TakeAttendancePageModule'
      },
      // { path: 'qr-otp', loadChildren: './pages/attendix/qr-otp/qr-otp.module#QrOtpPageModule' },
      // { path: 'take-picture', loadChildren: './pages/attendix/take-picture/take-picture.module#TakePicturePageModule' },
    ]
  },
  {
    path: 'feedback',
    loadChildren: './pages/feedback/feedback.module#FeedbackPageModule'
  },
  {
    path: 'bus-shuttle-services',
    loadChildren: './pages/bus-shuttle-services/bus-shuttle-services.module#BusShuttlePagePageModule'
  },
  {
    path: 'attendix-student',
    // canActivate: [AuthGuard],
    children: [
      {
        path: 'qr-code',
        loadChildren: './pages/attendix/qr-code/qr-code.module#QrCodePageModule'
      },
      {
        path: 'qr-otp',
        loadChildren: './pages/attendix/qr-otp/qr-otp.module#QrOtpPageModule'
      },
      {
        path: 'take-picture',
        loadChildren: './pages/attendix/take-picture/take-picture.module#TakePicturePageModule'
      }
    ]
  },
  {
    path: 'more',
    loadChildren: './pages/more/more.module#MorePageModule'
  },
  { path: 'fees', loadChildren: './pages/fees/fees.module#FeesPageModule' },
  { path: 'holidays', loadChildren: './pages/holidays/holidays.module#HolidaysPageModule' },
  {
    path: 'graduate-verification-service',
    loadChildren: './pages/graduate-verification-service/graduate-verification-service.module#GraduateVerificationServicePageModule'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
