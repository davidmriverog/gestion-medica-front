import { of } from 'rxjs';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';


import { Actions, createEffect, ofType } from '@ngrx/effects';

import { select, Store } from '@ngrx/store';
import { IAppState } from '../../core/states/core.state';
import { IContextService } from '../../../context/context.service';
import { initModeUI } from './ui-app.action';
import { map, tap } from 'rxjs/operators';

@Injectable()
export class UIAppStateEffect {

  initModeUI$ = createEffect(() => this.actions$.pipe(
    ofType(initModeUI),
    map((action) => action),
    tap((payload) => {


    })
  ), { dispatch: false });

  constructor(
    private actions$: Actions,
    private router: Router,
    private store: Store<IAppState>,
    private contextService: IContextService
  ) { }

}
