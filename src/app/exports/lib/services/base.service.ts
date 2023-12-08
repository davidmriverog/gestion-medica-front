import { Observable, throwError, of } from 'rxjs';
import { delay, finalize, retryWhen, mergeMap, tap, shareReplay } from 'rxjs/operators';
import { HttpClient, HttpParams } from '@angular/common/http';

import { environment } from './../../../../environments/environment';
import { CoreBaseModel } from '../classes/core-base-model.class';
import { IContextService } from '../context/context.service';
import { Injectable } from '@angular/core';

@Injectable()
export class BaseService {

  endPoint: string;
  _http: HttpClient;
  _contextService: IContextService;

  _modelClass: typeof CoreBaseModel;

  gqlName: string;

  get modelClass() {
    return this._modelClass;
  }
  set modelClass(model) {
    this._modelClass = model;

    this.gqlName = model.getGQLCrudName();
  }

  constructor(http: HttpClient, contextService: IContextService) {
      this._http = http;
      this._contextService = contextService;
  }
}
