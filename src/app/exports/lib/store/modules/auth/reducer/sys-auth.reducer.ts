import { createReducer, on, Action } from '@ngrx/store';

import * as sysAuthAction from '../action/sys-auth.action';
import { IAuthState } from '../state/sys-auth.state';


export const initialState: IAuthState = {
  isLoading: false,
  isFailed: false,
  errorMessage: null,
  userId: null,
  username: null,
  active: false,
  accessToken: null,
  email: null,
  userConnection: null,
  period: null,
  clientInfo: null,
  role: null,
  permissions: []
};

export const sysAuthScoreReducer = createReducer(
  initialState,
  on(sysAuthAction.login, (state, { username, password }) => {
    return Object.assign({}, state, {
      isLoading: true,
      isFailed: false,
      errorMessage: null,
    });
  }),
  on(sysAuthAction.successLogin, (state, { success }) => {

    localStorage.setItem('accessToken', success.accessToken);

    return Object.assign({}, state, {
      isLoading: true,
      isFailed: false,
      errorMessage: null,
      accessToken: success.accessToken
    });
  }),
  on(sysAuthAction.failedLogin, (state, { error }) => {

    return Object.assign({}, state, {
      isLoading: false,
      isFailed: true,
      errorMessage: error.error.message,
      userId: null,
      username: null,
      active: false,
      accessToken: null,
      email: null,
      userConnection: null,
      role: null,
      permissions: []
    });
  }),
  on(sysAuthAction.checkUser, (state, { }) => {

    const accessToken: string = localStorage.getItem('accessToken');

    return Object.assign({}, state, {
      isLoading: false,
      isFailed: false,
      accessToken: accessToken
    });
  }),
  on(sysAuthAction.meUser, (state, { results }) => {

    return Object.assign({}, state, {
      isLoading: false,
      isFailed: false,
      userId: results.userId,
      username: results.username,
      active: results.active,
      email: results.email,
      role: results.role,
      permissions: results.permissions,
      userConnection: results.userConnection,
      period: results.period,
      clientInfo: results.clientInfo
    });
  }),
  on(sysAuthAction.logoutUser, (state, { }) => {

    localStorage.removeItem('accessToken');

    return initialState;
  }),
  on(sysAuthAction.clearAuth, (state, { }) => {

    localStorage.removeItem('accessToken');

    return initialState;
  })
);

export function sysAuthReducer(state: IAuthState | undefined, action: Action) {
  return sysAuthScoreReducer(state, action);
}
