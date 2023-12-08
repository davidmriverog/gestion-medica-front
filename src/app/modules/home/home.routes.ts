import { Routes, RouterModule, Route } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';

import { AuthGuard, DashboardGuard } from '../../exports/lib';

import { DashboardComponent } from './dashboard/dashboard.component';
import { DashboardDoctorComponent } from './dashboard-doctor/dashboard-doctor.component';
import { DashboardClientComponent } from './dashboard-client/dashboard-client.component';
import { DashboardRecepcionistComponent } from './dashboard-receptionist/dashboard-receptionist.component';

const routes: Routes = [
  {
    path: "dashboard",
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "dashboard-doctor",
    component: DashboardDoctorComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "dashboard-client",
    component: DashboardClientComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "dashboard-recepcionist",
    component: DashboardRecepcionistComponent,
    canActivate: [AuthGuard]
  },
  { path: "**", redirectTo: "dashboard" }
];

export const RoutingModule: ModuleWithProviders<Route> = RouterModule.forChild(routes);