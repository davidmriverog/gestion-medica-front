import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { BaseService, IContextService } from '../../../exports/lib';

import { MedicalOfficeModel } from '../../models/clinic/medical-office.model';

@Injectable({
  providedIn: 'root'
})
export class MedicalOfficeService extends BaseService {

  constructor(private http: HttpClient, private contextService: IContextService) {
    super(http, contextService);

    this.modelClass = MedicalOfficeModel;
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
