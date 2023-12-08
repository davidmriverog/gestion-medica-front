import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, delay, map, mergeMap, retryWhen, tap } from 'rxjs/operators';
import { Observable, of, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';

import { BaseService, IContextService } from '../../../exports/lib';

import { PatientModel } from '../../models/clinic/patient.model';

@Injectable({
  providedIn: 'root'
})
export class PatientService extends BaseService {

  constructor(private http: HttpClient, private contextService: IContextService) {
    super(http, contextService);

    this.modelClass = PatientModel;
  }

  public findPatientByOwner(id: string): Observable<Array<PatientModel>> {
    return this.http.get<Array<PatientModel>>(`${environment.apiUrl}/${this.modelClass.getGQLCrudName()}/findPatientByOwner/${id}`);
  }

  searching(query: string): Observable<Array<PatientModel>> {

    let params = new HttpParams()
      .set('query', query);

    return this.http.get<Array<PatientModel>>(`${environment.apiUrl}/${this.modelClass.getGQLCrudName()}/searching`, { params }).pipe(
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
