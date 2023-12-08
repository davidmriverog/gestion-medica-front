import { mergeMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HTTP_INTERCEPTORS
} from '@angular/common/http';
import { Observable } from 'rxjs';

import { Store, select } from '@ngrx/store';

import { IAppState } from '../store/core/states/core.state';

@Injectable()
export class TokenInterceptorRequest implements HttpInterceptor {

  constructor(
    private store: Store<IAppState>
  ) {
    //
  }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {

    const token = localStorage.getItem('accessToken');

    if (token != null || token != undefined) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    return next.handle(request);
  }
}

export let tokenInterceptorProvider = {
  provide: HTTP_INTERCEPTORS,
  useClass: TokenInterceptorRequest,
  multi: true
};
