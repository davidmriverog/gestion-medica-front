import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgWizardConfig, NgWizardModule, THEME } from "ng-wizard";
import { RecaptchaModule } from 'ng-recaptcha';
import { ShowHidePasswordModule } from 'ngx-show-hide-password';

const ngWizardConfig: NgWizardConfig = {
  theme: THEME.default
};

import { SharedModule } from '../exports/lib';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RoutingModule } from './public.routes';

import { LoginComponent } from './login/login.component';
import { PublicComponent } from './public.component';
import { ForgotPasswordComponent } from './forgot/forgot-password.component';
import { NewPasswordComponent } from './new-password/new-password.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';

@NgModule({
  declarations: [
    PublicComponent,
    LoginComponent,
    ForgotPasswordComponent,
    NewPasswordComponent,
    RegisterComponent,
    HomeComponent
  ],
  imports: [
    RoutingModule,
    RecaptchaModule,
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    NgxSpinnerModule,
    NgWizardModule.forRoot(ngWizardConfig),
    SharedModule,
    ShowHidePasswordModule
  ],
  exports: [],
  providers: [],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class PublicModule { }
