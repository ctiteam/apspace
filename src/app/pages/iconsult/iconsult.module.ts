import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from '../../guards/auth.guard';
import { Role } from '../../interfaces';
import { RedirectGuard } from './redirect.guard';

/* tslint:disable:no-bitwise */
const routes: Routes = [
  {
    path: 'add-free-slot',
    canActivate: [AuthGuard],
    data: { role: Role.Admin | Role.Lecturer },
    loadChildren: () => import('./staff/add-free-slot/add-free-slot.module').then(m => m.AddFreeSlotPageModule)
  },
  {
    path: 'add-unavailability',
    canActivate: [AuthGuard],
    data: { role: Role.Admin | Role.Lecturer },
    loadChildren: () => import('./staff/add-unavailability/add-unavailability.module')
      .then(m => m.AddUnavailabilityPageModule)
  },
  {
    path: 'my-consultations',
    canActivate: [AuthGuard],
    data: { role: Role.Admin | Role.Lecturer },
    loadChildren: () => import('./staff/my-consultations/my-consultations.module').then(m => m.MyConsultationsPageModule)
  },
  {
    path: 'my-appointments',
    canActivate: [AuthGuard],
    data: { role: Role.Student },
    loadChildren: () => import('./student/my-appointments/my-appointments.module').then(m => m.MyAppointmentsPageModule)
  },
  {
    path: '',
    canActivate: [RedirectGuard]
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ]
})
export class IconsultModule { }
