import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { BaseService, CoreBaseModel, IAPIRecords, IContextService } from '../../../exports/lib';
import { catchError, map } from 'rxjs/operators';
import { ActMedicalModel } from '../../models/act/act-medical.model';

@Injectable({
  providedIn: 'root'
})
export class ActMedicalService extends BaseService {

  constructor(private http: HttpClient, private contextService: IContextService) {
    super(http, contextService)

    this.modelClass = ActMedicalModel;
  }

  public printPrescription(payload: any): Observable<any> {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('charset', 'utf8');

    return this.http.post(`${environment.apiUrl}/${this.modelClass.getGQLCrudName()}/prescriptions`, payload, { headers: headers, responseType: 'blob' }).pipe(
      map((response: any) => response),
      catchError(error => throwError(error))
    );
  }

  public attentionMedicalInfo(actMedicalId: string): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/${this.modelClass.getGQLCrudName()}/attentionMedicalInfo/${actMedicalId}`);
  }

  public listPaginateAttentionPatient(attrs: any): Observable<IAPIRecords<any[]>> {

    let params = new HttpParams()
      .set('q', btoa(JSON.stringify(attrs)));

    return this.http.get<IAPIRecords<any[]>>(`${environment.apiUrl}/${this.modelClass.getGQLCrudName()}/listAttentionByPatientPage`, { params: params });
  }
}
