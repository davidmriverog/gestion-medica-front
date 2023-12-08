import { Route, RouterModule, Routes } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';

import { PublicComponent } from './public.component';
import { LoginComponent } from './login/login.component';
import { ForgotPasswordComponent } from './forgot/forgot-password.component';
import { NewPasswordComponent } from './new-password/new-password.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  {
    path: "",
    component: PublicComponent,
    children: [
      {
        path: "",
        component: HomeComponent
      }
    ]
  },
  {
    path: "login",
    component: PublicComponent,
    children: [
      {
        path: "",
        component: LoginComponent
      }
    ]
  },
  {
    path: "forgot-password",
    component: PublicComponent,
    children: [
      {
        path: "",
        component: ForgotPasswordComponent
      }
    ]
  },
  {
    path: "new-password",
    component: PublicComponent,
    children: [
      {
        path: "",
        component: NewPasswordComponent
      }
    ]
  },
  {
    path: "register",
    component: RegisterComponent,
    children: [
      {
        path: "",
        component: NewPasswordComponent
      }
    ]
  }
];

export const RoutingModule: ModuleWithProviders<Route> = RouterModule.forChild(routes);
