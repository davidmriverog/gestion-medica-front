import { NgModule } from "@angular/core";

import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { EffectsModule } from '@ngrx/effects';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { CustomSerializer } from './core/serializers/custom-router.serializer';

import { EFFECTS } from './core/effects/core.effect';
import { environment } from '../../../../environments/environment';
import { reducers, metaReducers } from './core/reducers/core.reducter';

@NgModule({
  imports: [
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
    //
  ]
})
export class StoreAppModule {

}