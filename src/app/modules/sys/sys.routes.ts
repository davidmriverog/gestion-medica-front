import { Routes, RouterModule, Route } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';

import { AuthGuard } from '../../exports/lib';

import { RoListComponent } from './roles/roles.component';
import { UserListComponent } from './users/users.component';
import { StaffsComponent } from './staffs/staffs.component';
import { ResourceListComponent } from './resources/resources.component';
import { PermissionListComponent } from './permissions/permissions.component';
import { RolePermissionEditComponent } from './roles/role-permissions.component';

const routes: Routes = [
  {
    path: "roles",
    component: RoListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "role-permissions/:roleId",
    component: RolePermissionEditComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "resources",
    component: ResourceListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "permissions",
    component: PermissionListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "users",
    component: UserListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "staffs",
    component: StaffsComponent,
    canActivate: [AuthGuard]
  },
  { path: "**", redirectTo: "roles" }
];

export const RoutingModule: ModuleWithProviders<Route> = RouterModule.forChild(routes);
