import { createAction, props } from '@ngrx/store';
import { HttpErrorResponse } from '@angular/common/http';

export const login = createAction(
  '[SYSAUTH] - Iniciamos validacion del login!',
  props<{
    username: string,
    password: string
  }>()
);

export const successLogin = createAction(
  '[SYSAUTH] - Respuesta exitosa del login',
  props<{ success: any }>()
);

export const successRedirectDashboard = createAction(
  '[SYSAUTH] - Redireccion del dashboard'
);

export const failedLogin = createAction(
  '[SYSAUTH] - Respuesta fallida del login',
  props<{ error: HttpErrorResponse }>()
);

export const checkUser = createAction(
  '[SYSAUTH] - Verificamos datos del usuario de sesion.'
);

export const checkUserLogin = createAction(
  '[SYSAUTH] - Verificamos datos del usuario de sesion al iniciar..'
);

export const meUser = createAction(
  '[SYSAUTH] - Respuesta exitosa... verificacion ok',
  props<{ results: any }>()
);

export const logoutUser = createAction(
  '[SYSAUTH] - Cierre de sesión.'
);

export const clearAuth = createAction(
  '[SYSAUTH] - Limpiamos auth..'
);

export const requestForgotPassword = createAction(
  '[SYSAUTH] - Solicitamos cambio de claves',
  props<{
    email: string
  }>()
);

export const sendNewPassword = createAction(
  '[SYSAUTH] - Enviamos nueva clave',
  props<{
    code: string,
    newPassword: string
  }>()
);

export const successNewPassword = createAction(
  '[SYSAUTH] - Respuesta exitosa del cambio de claves',
  props<{ success: any }>()
);

export const failedNewPassword = createAction(
  '[SYSAUTH] - Respuesta fallida del cambio de claves',
  props<{ error: HttpErrorResponse }>()
);