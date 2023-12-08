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
import { getToken } from '../store/modules/auth/selector/sys-auth.selector';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {

  constructor(
    private router: Router,
    private store: Store<IAppState>
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {

    return this.store.pipe(
      select(getToken),
      switchMap((user) => {

        if (user != null) {
          return of(true);
        }

        this.router.navigate(['/login']);

        return of(false);
      })
    );
  }
}
