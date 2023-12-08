import { Routes, RouterModule, Route } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';

import { AuthGuard } from '../../exports/lib';

import { PlanningTurnCreateComponent } from './planning-turn-create/planning-turn-create.component';

import { ProgramingTurnComponent } from './programming/programming.component';
import { ProgramingListComponent } from './programming/programming-list.component';
import { PlanningMedicalTurnDetailComponent } from './programming/programming-detail.component';

const routes: Routes = [
  {
    path: "planning-turn-create",
    component: PlanningTurnCreateComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "programming",
    component: ProgramingTurnComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "reprograming-list-by-date",
    component: ProgramingListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "planning-medical-turn-detail/:id",
    component: PlanningMedicalTurnDetailComponent,
    canActivate: [AuthGuard]
  },
  { path: "**", redirectTo: "planning-turns" }
];

export const RoutingModule: ModuleWithProviders<Route> = RouterModule.forChild(routes);