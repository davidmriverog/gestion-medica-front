import { Routes, RouterModule, Route } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';

import { AuthGuard } from '../../exports/lib';

import { SaleCreateComponent } from './sale-create/sale-create.component';
import { SaleListsComponent } from './sales/sales.component';
import { SaleDetailComponent } from './sale-detail/sale-detail.component';

const routes: Routes = [
  {
    path: "sale-create",
    component: SaleCreateComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "sales",
    component: SaleListsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "sale-detail/:id",
    component: SaleDetailComponent,
    canActivate: [AuthGuard]
  },
  { path: "**", redirectTo: "sales" }
];

export const RoutingModule: ModuleWithProviders<Route> = RouterModule.forChild(routes);