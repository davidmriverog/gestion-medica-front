import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, delay, map, mergeMap, retryWhen, tap } from 'rxjs/operators';

import { BaseService, IContextService } from '../../../exports/lib';

import { HttpHeaders } from '@angular/common/http';

import { environment } from '../../../../environments/environment';

import { DiagnosticModel } from '../../models/clinic/diagnostic.model';

@Injectable({
  providedIn: 'root'
})
export class DiagnosticService extends BaseService {

  constructor(private http: HttpClient, private contextService: IContextService) {
    super(http, contextService);

    this.modelClass = DiagnosticModel;
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

  searching(query: string): Observable<Array<DiagnosticModel>> {

    let params = new HttpParams()
      .set('query', query);

    return this.http.get<Array<DiagnosticModel>>(`${environment.apiUrl}/${this.modelClass.getGQLCrudName()}/searching`, { params }).pipe(
      retryWhen(errors => {
        return errors.pipe(
          delay(1500),
          mergeMap((error, index) => {
            console.log(`[${index}] - intento...`, error);

            if (index === 4) {

              return throwError(error);
            } else {
              return of(error);
            }

          }),
          tap(() => console.log('retry...'))
        );
      })
    )
  }
}
