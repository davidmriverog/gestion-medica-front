import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HTTP_INTERCEPTORS
} from '@angular/common/http';
import { Observable, of } from 'rxjs';

@Injectable()
export class InterceptorRequest implements HttpInterceptor {
  constructor() { }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {

    return next.handle(request);
  }
}

export let requestInterceptorProvider = {
  provide: HTTP_INTERCEPTORS,
  useClass: InterceptorRequest,
  multi: true
};
