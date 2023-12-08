import {
  ActionReducerMap,
  MetaReducer
} from '@ngrx/store';

import * as fromRouter from '@ngrx/router-store';
import { environment } from '../../../../../../environments/environment';

import { IAppState } from '../states/core.state';
import { sysAuthReducer } from '../../modules/auth';
import { uiAppStateReducer } from '../../modules/ui-app';

export const reducers: ActionReducerMap<IAppState> = {
  router: fromRouter.routerReducer,
  auth: sysAuthReducer,
  uiApp: uiAppStateReducer
};

export const metaReducers: MetaReducer<IAppState>[] = !environment.production ? [] : [];