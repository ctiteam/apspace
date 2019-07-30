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
    loadChildren: () => import('./pages/login/login.module').then(m => m.LoginPageModule),
    canActivate: [DeauthGuard]
  },
  {
    path: 'tabs',
    loadChildren: () => import('./pages/tabs/tabs.module').then(m => m.TabsPageModule),
    canActivate: [AuthGuard]
  },

  {
    path: 'student-timetable',
    loadChildren: () => import('./pages/student-timetable/student-timetable.module').then(m => m.StudentTimetablePageModule)
  },
  {
    path: 'staffs',
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        loadChildren: () => import('./pages/staff-directory/staff-directory.module').then(m => m.StaffDirectoryPageModule)
      }
    ]
  },
  {
    path: 'staff',
    loadChildren: () => import('./pages/staff-directory-info/staff-directory-info.module').then(m => m.StaffDirectoryInfoPageModule)
  },
  {
    path: 'feedback',
    loadChildren: () => import('./pages/feedback/feedback.module').then(m => m.FeedbackPageModule)
  },
  {
    path: 'attendix-lecturer',
    // canActivate: [AuthGuard],
    children: [
      {
        path: 'classes',
        loadChildren:
          () => import('./pages/attendix/attendix-lecturer/classes/classes.module').then(m => m.ClassesPageModule)
      },
      {
        path: 'take-attendance',
        loadChildren:
          () => import('./pages/attendix/attendix-lecturer/take-attendance/take-attendance.module').then(m => m.TakeAttendancePageModule)
      },
      // { path: 'qr-otp', loadChildren: './pages/attendix/qr-otp/qr-otp.module#QrOtpPageModule' },
      // { path: 'take-picture', loadChildren: './pages/attendix/take-picture/take-picture.module#TakePicturePageModule' },
    ]
  },
  {
    path: 'feedback',
    loadChildren: () => import('./pages/feedback/feedback.module').then(m => m.FeedbackPageModule)
  },
  {
    path: 'bus-shuttle-services',
    loadChildren: () => import('./pages/bus-shuttle-services/bus-shuttle-services.module').then(m => m.BusShuttlePagePageModule)
  },
  {
    path: 'attendix-student',
    // canActivate: [AuthGuard],
    children: [
      {
        path: 'qr-code',
        loadChildren: () => import('./pages/attendix/qr-code/qr-code.module').then(m => m.QrCodePageModule)
      },
      {
        path: 'qr-otp',
        loadChildren: () => import('./pages/attendix/qr-otp/qr-otp.module').then(m => m.QrOtpPageModule)
      },
      {
        path: 'take-picture',
        loadChildren: () => import('./pages/attendix/take-picture/take-picture.module').then(m => m.TakePicturePageModule)
      }
    ]
  },
  {
    path: 'more',
    loadChildren: () => import('./pages/more/more.module').then(m => m.MorePageModule)
  },
  {
    path: 'fees',
    loadChildren: () => import('./pages/fees/fees.module').then(m => m.FeesPageModule)
  },
  {
    path: 'holidays',
    loadChildren: () => import('./pages/holidays/holidays.module').then(m => m.HolidaysPageModule)
  },
  {
    path: 'graduate-verification-service',
    loadChildren: () => import('./pages/graduate-verification-service/graduate-verification-service.module')
      .then(m => m.GraduateVerificationServicePageModule)
  },
  {
    path: 'exam-schedule',
    loadChildren: () => import('./pages/exam-schedule/exam-schedule.module').then(m => m.ExamSchedulePageModule)
  },
  {
    path: 'news',
    loadChildren: () => import('./pages/news/news.module').then(m => m.NewsPageModule)
  },
  {
    path: 'settings',
    loadChildren: () => import('./pages/settings/settings.module').then(m => m.SettingsPageModule)
  },
  {
    path: 'exam-schedule',
    loadChildren: () => import('./pages/exam-schedule/exam-schedule.module').then(m => m.ExamSchedulePageModule) },
  {
    path: 'news',
    loadChildren: () => import('./pages/news/news.module').then(m => m.NewsPageModule) },
  {
    path: 'set-security-questions',
    loadChildren: () =>
    import('./pages/settings/set-security-questions/set-security-questions.module').then(m => m.SetSecurityQuestionsPageModule)
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
