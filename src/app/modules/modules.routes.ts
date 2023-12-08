import { Route, RouterModule, Routes } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';

import { AdminComponent } from '../exports/lib';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      { path: 'profile', loadChildren: () => import('./profile/profile.module').then(m => m.ProfileModule) },
      { path: 'ar', loadChildren: () => import('./ar/ar.module').then(m => m.ArModule) },
      { path: 'ac', loadChildren: () => import('./ac/ac.module').then(m => m.AcModule) },
      { path: 'client', loadChildren: () => import('./client/client.module').then(m => m.ClientModule) },
      { path: 'act', loadChildren: () => import('./act/act.module').then(m => m.ActModule) },
      { path: 'ms', loadChildren: () => import('./ms/ms.module').then(m => m.MsModule) },
      { path: 'home', loadChildren: () => import('./home/home.module').then(m => m.HomeModule) },
      { path: 'conf', loadChildren: () => import('./config/config.module').then(m => m.ConfigModule) },
      { path: 'sys', loadChildren: () => import('./sys/sys.module').then(m => m.SysModule) },
      { path: 'clinic', loadChildren: () => import('./clinic/clinic.module').then(m => m.ClinicModule) },
      { path: 'prog', loadChildren: () => import('./prog/prog.module').then(m => m.ProgModule) },
      { path: '**', redirectTo: 'home' }
    ]
  },
  { path: '**', redirectTo: '' }
];

export const RoutingModule: ModuleWithProviders<Route> = RouterModule.forChild(routes);
