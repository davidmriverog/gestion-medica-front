import { createSelector, createFeatureSelector } from '@ngrx/store';

import { IAppState } from '../../core/states/core.state';
import { IUIAppState } from './ui-app.state';


export const selectUIAppState = createFeatureSelector<IAppState, IUIAppState>('uiApp');

export const getMode = createSelector(
  selectUIAppState,
  (state: IUIAppState) => state.mode
);