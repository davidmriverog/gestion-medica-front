import * as fromRouter from '@ngrx/router-store';

import { IAuthState } from '../../modules/auth';
import { IUIAppState } from '../../modules/ui-app';

export interface IAppState {
  router: fromRouter.RouterReducerState<any>;
  auth: IAuthState,
  uiApp: IUIAppState
}