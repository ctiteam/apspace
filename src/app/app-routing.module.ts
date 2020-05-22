import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './guards/auth.guard';
import { DeauthGuard } from './guards/deauth.guard';
import { Role } from './interfaces';

/* tslint:disable:no-bitwise */
const routes: Routes = [
  {
    path: '',
    redirectTo: 'tabs',
    pathMatch: 'full'
  },
  {
    path: 'login',
    canActivate: [DeauthGuard],
    loadChildren: () => import('./pages/login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'tabs',
    canActivate: [AuthGuard],
    data: { role: Role.Student | Role.Lecturer | Role.Admin },
    loadChildren: () => import('./pages/tabs/tabs.module').then(m => m.TabsPageModule)
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
      },
      {
        path: '',
        loadChildren: () => import('./pages/staff-directory-info/staff-directory-info.module').then(m => m.StaffDirectoryInfoPageModule)
      },
      {
        path: ':id/consultations',
        loadChildren: () => import('./pages/iconsult/student/opened-slots/opened-slots.module').then(m => m.OpenedSlotsPageModule)
      }
    ]
  },
  {
    path: 'feedback',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/feedback/feedback.module').then(m => m.FeedbackPageModule)
  },
  {
    path: 'bus-shuttle-services',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/bus-shuttle-services/bus-shuttle-services.module').then(m => m.BusShuttleServicesPageModule)
  },
  {
    path: 'attendix',
    canActivateChild: [AuthGuard],
    children: [
      {
        path: 'classes',
        data: { role: Role.Lecturer | Role.Admin },
        loadChildren:
          () => import('./pages/attendix-lecturer/classes/classes.module').then(m => m.ClassesPageModule)
      },
      {
        path: 'mark-attendance',
        data: { role: Role.Lecturer | Role.Admin },
        loadChildren:
          () => import('./pages/attendix-lecturer/mark-attendance/mark-attendance.module').then(m => m.MarkAttendancePageModule)
      },
      {
        path: 'update',
        data: { role: Role.Student },
        loadChildren:
          () => import('./pages/attendix-student/attendix-student.module').then(m => m.AttendixStudentPageModule)
      }
    ]
  },
  {
    path: 'more',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/more/more.module').then(m => m.MorePageModule)
  },
  {
    path: 'attendance',
    canActivate: [AuthGuard],
    data: { role: Role.Student },
    loadChildren: () => import('./pages/attendance/attendance.module').then(m => m.AttendancePageModule)
  },
  {
    path: 'apcard',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/apcard/apcard.module').then(m => m.ApcardPageModule)
  },
  {
    path: 'fees',
    canActivate: [AuthGuard],
    data: { role: Role.Student },
    loadChildren: () => import('./pages/fees/fees.module').then(m => m.FeesPageModule)
  },
  {
    path: 'holidays',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/holidays/holidays.module').then(m => m.HolidaysPageModule)
  },
  {
    path: 'graduate-verification-service',
    loadChildren: () => import('./pages/graduate-verification-service/graduate-verification-service.module')
      .then(m => m.GraduateVerificationServicePageModule)
  },
  {
    path: 'exam-schedule-admin',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/exam-schedule-admin/exam-schedule-admin.module').then( m => m.ExamScheduleAdminPageModule)
  },
  {
    path: 'exam-schedule-details/:examId',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./pages/exam-schedule-admin/exam-schedule-details/exam-schedule-details.module').then(m => m.ExamScheduleDetailsPageModule)
  },
  {
    path: 'exam-schedule',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/exam-schedule/exam-schedule.module').then(m => m.ExamSchedulePageModule)
  },
  {
    path: 'news',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/news/news.module').then(m => m.NewsPageModule)
  },
  {
    path: 'settings',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/settings/settings.module').then(m => m.SettingsPageModule)
  },
  {
    path: 'set-security-questions',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/settings/set-security-questions/set-security-questions.module')
      .then(m => m.SetSecurityQuestionsPageModule)
  },
  {
    path: 'notifications',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/notifications/notifications.module').then(m => m.NotificationsPageModule)
  },
  {
    path: 'classroom-finder',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/classroom-finder/classroom-finder.module').then(m => m.ClassroomFinderPageModule)
  },
  {
    path: 'profile',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/profile/profile.module').then(m => m.ProfilePageModule)
  },

  {
    path: 'operation-hours',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/operation-hours/operation-hours.module').then(m => m.OperationHoursPageModule)
  },
  {
    path: 'student-survey',
    canActivate: [AuthGuard],
    data: { role: Role.Student },
    loadChildren: () => import('./pages/student-survey/student-survey.module').then(m => m.SubmitSurveyPageModule)
  },
  {
    path: 'results',
    canActivate: [AuthGuard],
    data: { role: Role.Student },
    loadChildren: () => import('./pages/results/results.module').then(m => m.ResultsPageModule)
  },
  {
    path: 'lecturer-timetable',
    canActivate: [AuthGuard],
    data: { role: Role.Lecturer },
    loadChildren: () => import('./pages/lecturer-timetable/lecturer-timetable.module').then(m => m.LecturerTimetablePageModule)
  },
  {
    path: 'logout',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/logout/logout.module').then(m => m.LogoutPageModule)
  },

  // iConsult Routes
  {
    path: 'iconsult',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/iconsult/iconsult.module').then(m => m.IconsultModule)
  },
  {
    path: 'aplc-progress-report',
    canActivate: [AuthGuard],
    data: { role: Role.Admin | Role.Lecturer },
    loadChildren: () => import('./pages/aplc-progress-report/aplc-progress-report.module').then(m => m.AplcProgressReportPageModule)
  },
  {
    path: 'staff-dashboard',
    canActivate: [AuthGuard],
    data: { role: Role.Lecturer },
    loadChildren: () => import('./pages/staff-dashboard/staff-dashboard.module').then(m => m.StaffDashboardPageModule)
  },
  {
    path: 'change-password',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/settings/change-password/change-password.module')
      .then(m => m.ChangePasswordPageModule)
  },
  {
    path: 'change-webspace-password',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/settings/change-webspace-password/change-webspace-password.module')
      .then( m => m.ChangeWebspacePasswordPageModule)
  },
  {
    path: 'reset-webspace-password',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/settings/reset-webspace-password/reset-webspace-password.module')
      .then( m => m.ResetWebspacePasswordPageModule)
  },
  {
    path: 'visa-status',
    canActivate: [AuthGuard],
    data: { role: Role.Admin | Role.Student },
    loadChildren: () => import('./pages/visa-status/visa-status.module').then(m => m.VisaStatusPageModule)
  },
  {
    path: 'maintenance-and-update',
    loadChildren: () => import('./pages/maintenance-and-update/maintenance-and-update.module').then(m => m.MaintenanceAndUpdatePageModule)
  },
  {
    path: 'unauthorized',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/unauthorized/unauthorized.module').then(m => m.UnauthorizedPageModule)
  },
  {
    path: 'beapu',
    canActivate: [AuthGuard],
    // data: { role: Role.Admin | Role.Lecturer },
    loadChildren: () => import('./pages/filing-report/filing-report.module').then(m => m.FilingReportPageModule)
  },
  {
    // only available via URL. No Menu item created for this
    path: 'igraduate',
    canActivate: [AuthGuard],
    data: { role: Role.Admin | Role.Lecturer },
    loadChildren: () => import('./pages/igraduate/igraduate.module').then(m => m.IgraduatePageModule)
  },
  {
    path: 'hr',
    canActivate: [AuthGuard],
    data: { role: Role.Admin | Role.Lecturer },
    loadChildren: () => import('./pages/hr/hr.module').then(m => m.HrPageModule)
  },
  {
    path: 'mentorship',
    canActivate: [AuthGuard],
    data: { role: Role.Admin | Role.Lecturer },
    loadChildren: () => import('./pages/mentorship/mentorship.module').then(m => m.MentorshipPageModule)
  },
  {
    path: 'students-results',
    canActivate: [AuthGuard],
    data: { role: Role.Admin | Role.Lecturer },
    loadChildren: () => import('./pages/students-search/students-search.module').then( m => m.StudentsSearchPageModule)
  },
  { // this path must always be at the end of the routes array
    path: '**',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/not-found/not-found.module').then(m => m.NotFoundPageModule)
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
