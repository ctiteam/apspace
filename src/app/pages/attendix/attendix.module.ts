/** Lazy-loaded feature module to separate GraphQLModule and save 1MB. */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { GraphQLModule } from '../../graphql.module';
import { AuthGuard } from '../../guards/auth.guard';
import { Role } from '../../interfaces';

const routes: Routes = [
  {
    path: 'classes',
    canActivate: [AuthGuard],
    // tslint:disable-next-line:no-bitwise
    data: { role: Role.Lecturer | Role.Admin },
    loadChildren:
      () => import('./classes/classes.module').then(m => m.ClassesPageModule)
  },
  {
    path: 'mark-attendance',
    canActivate: [AuthGuard],
    // tslint:disable-next-line:no-bitwise
    data: { role: Role.Lecturer | Role.Admin },
    loadChildren:
      () => import('./mark-attendance/mark-attendance.module').then(m => m.MarkAttendancePageModule)
  },
  {
    path: 'update',
    canActivate: [AuthGuard],
    data: { role: Role.Student },
    loadChildren:
      () => import('./student/student.module').then(m => m.StudentPageModule)
  }
];

@NgModule({
  imports: [
    CommonModule,
    GraphQLModule,
    RouterModule.forChild(routes)
  ]
})
export class AttendixModule {}
