import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { NgbButtonsModule, NgbDropdownModule, NgbModule, NgbTabsetModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PublicModule } from './public/public.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { DataTablesModule } from 'angular-datatables';
import { ToastrModule } from 'ngx-toastr';
import { NgxSpinnerModule } from "ngx-spinner";
import { NgWizardModule, NgWizardConfig, THEME } from 'ng-wizard';
import { RECAPTCHA_V3_SITE_KEY, RecaptchaV3Module } from "ng-recaptcha";
import {
  RECAPTCHA_SETTINGS,
  RecaptchaModule,
  RecaptchaSettings,
} from 'ng-recaptcha';

const globalSettings: RecaptchaSettings = { siteKey: '6LcOuyYTAAAAAHTjFuqhA52fmfJ_j5iFk5PsfXaU' };

const ngWizardConfig: NgWizardConfig = {
  theme: THEME.default
};

import { AppModules } from './modules/modules.module';
import { NgxPermissionsModule } from 'ngx-permissions';

import { CustomSerializer, EFFECTS, metaReducers, reducers, tokenInterceptorProvider } from './exports/lib';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from 'src/environments/environment';
import { EffectsModule } from '@ngrx/effects';
import { StoreRouterConnectingModule } from '@ngrx/router-store';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    RecaptchaModule,
    PublicModule,
    BrowserAnimationsModule,
    AppModules,
    NgxPermissionsModule.forRoot(),
    DataTablesModule,
    ToastrModule.forRoot(),
    NgWizardModule.forRoot(ngWizardConfig),
    NgxSpinnerModule,
    NgbDropdownModule,
    NgbTooltipModule,
    NgbButtonsModule,
    NgbTabsetModule,
    StoreModule.forRoot(reducers, {
      metaReducers,
      runtimeChecks: {
        strictStateImmutability: true,
        strictActionImmutability: true
      }
    }),
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: environment.production }),
    EffectsModule.forRoot(EFFECTS),
    StoreRouterConnectingModule.forRoot({
      serializer: CustomSerializer
    })
  ],
  exports: [

  ],
  providers: [
    tokenInterceptorProvider,
    {
      provide: RECAPTCHA_SETTINGS,
      useValue: globalSettings,
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
