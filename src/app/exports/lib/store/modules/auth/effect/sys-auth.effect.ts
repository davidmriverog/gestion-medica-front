
import { of } from 'rxjs';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { map, mergeMap, tap, catchError, take, concatMap, withLatestFrom, exhaustMap, delay, switchMap } from 'rxjs/operators';

import { Actions, createEffect, ofType } from '@ngrx/effects';

import { HttpErrorResponse } from '@angular/common/http';
import { select, Store } from '@ngrx/store';

import { IAppState } from '../../../core/states/core.state';
import { environment } from '../../../../../../../environments/environment';
import {
  login,
  successLogin,
  failedLogin,
  meUser,
  checkUser,
  logoutUser,
  requestForgotPassword,
  sendNewPassword,
  successNewPassword,
  failedNewPassword,
  successRedirectDashboard,
  checkUserLogin
} from '../action/sys-auth.action';

import { AuthService } from '../../../../services/auth.service';
import { NgxPermissionsService, NgxRolesService } from 'ngx-permissions';
import { IContextService } from '../../../../context/context.service';
import { ToastrService } from 'ngx-toastr';
import { getRole, getRoles } from '../selector/sys-auth.selector';
import { RoleEnum } from '../../../../../../core/enums/sys/rol-values.enum';

@Injectable()
export class SysAuthEffect {

  login$ = createEffect(() => this.actions$.pipe(
    ofType(login),
    map((action) => action),
    exhaustMap((action) => {

      return this.http.post<any>(`${environment.apiUrl}/auth/login`, {
        username: action.username,
        password: action.password
      }).pipe(
        map((res) => successLogin({
          success: res
        })),
        catchError((err: HttpErrorResponse) => of(failedLogin({ error: err })))
      );
    })
  ));

  successLogin$ = createEffect(() => this.actions$.pipe(
    ofType(successLogin),
    map((action) => action),
    tap((payload) => {
      console.log('ingreso exitoso..');
    }),
    switchMap((action) => [
      checkUserLogin()
    ]),
  ));

  successRedirectDashboard$ = createEffect(() => this.actions$.pipe(
    ofType(successRedirectDashboard),
    map((action) => action),
    concatMap(action => of(action).pipe(
      withLatestFrom(
        this.store.pipe(select(getRole)) // viene del storage
      )
    )),
    tap(([payload, role]) => {

      switch (role) {
        case RoleEnum.Admin:
          this.router.navigate(['/home/dashboard']);
          break;
        case RoleEnum.RootAdmin:
          this.router.navigate(['/home/dashboard']);
          break;
        case RoleEnum.Medical:
          this.router.navigate(['/home/dashboard-doctor']);
          break;
        case RoleEnum.Patient:
          this.router.navigate(['/home/dashboard-client']);
          break;
        case RoleEnum.Receptionist:
          this.router.navigate(['/home/dashboard-recepcionist']);
          break;
      }
    })
  ), { dispatch: false });

  failedLogin$ = createEffect(() => this.actions$.pipe(
    ofType(failedLogin),
    map((action) => action),
    tap((payload) => {
      // action failed!!
      this.router.navigate(['/login']);
    })
  ), { dispatch: false });

  logoutUser$ = createEffect(() => this.actions$.pipe(
    ofType(logoutUser),
    map((action) => action),
    tap((payload) => {

      this.router.navigate(['/login']);
    })
  ), { dispatch: false });

  checkUser$ = createEffect(() => this.actions$.pipe(
    ofType(checkUser),
    map((action) => action),
    exhaustMap((action) => {

      return this.authService.meUser().pipe(
        map((response) => response),
        map((res) => meUser({
          results: res
        }))
      );
    })
  ));

  checkUserLogin$ = createEffect(() => this.actions$.pipe(
    ofType(checkUserLogin),
    map((action) => action),
    exhaustMap((action) => {

      return this.authService.meUser().pipe(
        map((response) => response),
        mergeMap((res) => [
          meUser({
            results: res
          }),
          successRedirectDashboard()
        ])
      );
    })
  ));

  requestForgotPassword$ = createEffect(() => this.actions$.pipe(
    ofType(requestForgotPassword),
    map((action) => action),
    exhaustMap((action) => {

      this.contextService.startLoading();

      return this.authService.requestCodeForgotPassword(action.email).pipe(
        delay(3000),
        map((response) => response)
      );
    }),
    tap((result) => {

      this.contextService.stopLoading();
      this.toastService.success('Te hemos enviado un correo', 'Solicitud exitosa!');
      this.router.navigate(['/login']);
    })
  ), { dispatch: false });

  meUser$ = createEffect(() => this.actions$.pipe(
    ofType(meUser),
    map((action) => action),
    tap((payload) => {

      // this.permissionsService.flushPermissions();
      this.ngxRoleService.flushRolesAndPermissions();

      this.ngxRoleService.addRoleWithPermissions(payload.results.role, payload.results.permissions);
    })
  ), { dispatch: false });

  sendNewPassword$ = createEffect(() => this.actions$.pipe(
    ofType(sendNewPassword),
    map((action) => action),
    exhaustMap((action) => {

      this.contextService.startLoading();

      return this.authService.newPassword({
        code: action.code,
        newPassword: action.newPassword
      }).pipe(
        map((res) => successNewPassword({
          success: res
        })),
        catchError((err: HttpErrorResponse) => of(failedLogin({ error: err })))
      );
    })
  ));

  successNewPassword$ = createEffect(() => this.actions$.pipe(
    ofType(successNewPassword),
    map((action) => action),
    tap((payload) => {
      // ok
      this.contextService.stopLoading();
      this.toastService.success('Hemos actualizado la clave exitosamente', 'Proceso exitoso!')

      this.router.navigate(['/login']);
    })
  ), { dispatch: false });

  failedNewPassword$ = createEffect(() => this.actions$.pipe(
    ofType(failedNewPassword),
    map((action) => action),
    tap((payload) => {
      // action failed!!
      // this.router.navigate(['/login']);
      this.contextService.stopLoading();

      this.toastService.error(`${payload.error.message}`, `Ops!`);
    })
  ), { dispatch: false });

  constructor(
    private actions$: Actions,
    private router: Router,
    private authService: AuthService,
    private store: Store<IAppState>,
    private permissionsService: NgxPermissionsService,
    private ngxRoleService: NgxRolesService,
    private http: HttpClient,
    private contextService: IContextService,
    private toastService: ToastrService
  ) { }

}
