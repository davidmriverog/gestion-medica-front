import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { BaseService, IContextService } from '../../../exports/lib';
import { environment } from '../../../../environments/environment';
import { catchError, delay, map, mergeMap, retryWhen, tap } from 'rxjs/operators';

import { AffectionModel } from '../../models/clinic/affection.model';


@Injectable({
  providedIn: 'root'
})
export class AffectionService extends BaseService {

  constructor(private http: HttpClient, private contextService: IContextService) {
    super(http, contextService);

    this.modelClass = AffectionModel;
  }

  public download(): Observable<any> {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('charset', 'utf8');

    return this.http.post(`${environment.apiUrl}/${this.modelClass.getGQLCrudName()}/download`, {}, { headers: headers, responseType: 'blob' }).pipe(
      map((response: any) => response),
      catchError(error => throwError(error))
    );
  }

  public import(payload: any): Observable<any> {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('charset', 'utf8');

    return this.http.post(`${environment.apiUrl}/${this.modelClass.getGQLCrudName()}/import`, payload, { headers: headers, responseType: 'blob' }).pipe(
      map((response: any) => response),
      catchError(error => throwError(error))
    );
  }
}
