import { createSelector, createFeatureSelector } from '@ngrx/store';

import { IAuthState } from '../state/sys-auth.state';
import { IAppState } from '../../../core/states/core.state';

export const selectAuthState = createFeatureSelector<IAppState, IAuthState>('auth');

export const getLoading = createSelector(
  selectAuthState,
  (state: IAuthState) => state.isLoading
);

export const isFailedLogin = createSelector(
  selectAuthState,
  (state: IAuthState) => state.isFailed
);

export const errorMessage = createSelector(
  selectAuthState,
  (state: IAuthState) => state.errorMessage
);

export const getToken = createSelector(
  selectAuthState,
  (state: IAuthState) => state.accessToken
);

export const getUserId = createSelector(
  selectAuthState,
  (state: IAuthState) => state.userId
);

export const getUsername = createSelector(
  selectAuthState,
  (state: IAuthState) => state.username
);

export const getEmail = createSelector(
  selectAuthState,
  (state: IAuthState) => state.email
);

export const getUserState = createSelector(
  selectAuthState,
  (state: IAuthState) => state.active
);

export const getRole = createSelector(
  selectAuthState,
  (state: IAuthState) => state.role
);

export const getRoles = createSelector(
  selectAuthState,
  (state: IAuthState) => state.permissions
);

export const getUserMedic = createSelector(
  selectAuthState,
  (state: IAuthState) => state.userConnection?.doctor
);

export const getUserConnection = createSelector(
  selectAuthState,
  (state: IAuthState) => state.userConnection
);

export const getPeriod = createSelector(
  selectAuthState,
  (state: IAuthState) => state.period
);

export const getUserStaff = createSelector(
  selectAuthState,
  (state: IAuthState) => state.userConnection?.staff
);

export const getUserPatient = createSelector(
  selectAuthState,
  (state: IAuthState) => state.userConnection?.patient
);

export const getClientInfo = createSelector(
  selectAuthState,
  (state: IAuthState) => state.clientInfo
);

export const getCurrency = createSelector(
  selectAuthState,
  (state: IAuthState) => state.clientInfo?.currency
);