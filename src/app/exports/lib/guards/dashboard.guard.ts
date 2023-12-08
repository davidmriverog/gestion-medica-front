import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';

import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { IAppState } from '../store/core/states/core.state';
import { getRole, getRoles, getToken } from '../store/modules/auth/selector/sys-auth.selector';
import { RoleEnum } from '../../../core/enums/sys/rol-values.enum';

@Injectable({ providedIn: 'root' })
export class DashboardGuard implements CanActivate {

  constructor(
    private router: Router,
    private store: Store<IAppState>
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {

    return this.store.pipe(
      select(getRole),
      switchMap((role) => {


        switch (role) {
          case RoleEnum.RootAdmin:
            this.router.navigate(['/home/dashoard']);
            return of(true);
          case RoleEnum.Admin:
            this.router.navigate(['/home/dashoard']);
            return of(true);
          case RoleEnum.Medical:
            this.router.navigate(['/home/dashoard-doctor']);
            return of(true);
          case RoleEnum.Patient:
            this.router.navigate(['/home/dashoard-client']);
            return of(true);
          case RoleEnum.Receptionist:
            this.router.navigate(['/home/dashoard-receptionist']);
            return of(true);
        }

        return of(false);
      })
    );
  }
}
