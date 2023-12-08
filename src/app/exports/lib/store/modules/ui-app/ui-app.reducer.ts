import { createReducer, on, Action } from '@ngrx/store';

import * as uiAppStateAction from './ui-app.action';

import { IUIAppState } from './ui-app.state';

export const initialUIAppState: IUIAppState = {
  mode: ''
};

export const uiAppStateScoreReducer = createReducer(
  initialUIAppState,
  on(uiAppStateAction.initModeUI, (state, { }) => {

    const mode: string = localStorage.getItem('mode');

    console.log('chequeamos', mode)

    return Object.assign({}, state, {
      mode: mode
    });
  }),
  on(uiAppStateAction.setModeUI, (state, { mode }) => {

    localStorage.setItem('mode', mode);

    return Object.assign({}, state, <IUIAppState>{
      mode: mode
    });
  })
);

export function uiAppStateReducer(state: IUIAppState | undefined, action: Action) {
  return uiAppStateScoreReducer(state, action);
}
