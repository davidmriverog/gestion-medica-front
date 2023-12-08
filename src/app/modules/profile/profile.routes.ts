import { Routes, RouterModule, Route } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';

import { AuthGuard } from '../../exports/lib';

import { ProfilePatientComponent } from './profile-patient/profile-patient.component';

const routes: Routes = [
  {
    path: "profile-patient",
    component: ProfilePatientComponent,
    canActivate: [AuthGuard]
  },
];

export const RoutingModule: ModuleWithProviders<Route> = RouterModule.forChild(routes);
