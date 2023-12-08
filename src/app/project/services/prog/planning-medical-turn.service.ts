import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { BaseService, IContextService } from '../../../exports/lib';
import { environment } from '../../../../environments/environment';
import { ProgMedicalCalendar } from '../../../core/interfaces/prog-medical-doctor.interface';

import { PlanningMedicalTurnModel } from '../../models/prog/planning-medical-turn.model';

@Injectable({
  providedIn: 'root'
})
export class PlanningMedicalTurnService extends BaseService {

  constructor(private http: HttpClient, private contextService: IContextService) {
    super(http, contextService);

    this.modelClass = PlanningMedicalTurnModel;
  }

  public toggleActive(id: string, active: boolean): Observable<any> {
    return this.http.put<any>(`${environment.apiUrl}/${this.modelClass.getGQLCrudName()}/toggleActive/${id}`, { active: active });
  }

  public submitNewMedicalTurn(request: any): Observable<Array<PlanningMedicalTurnModel>> {

    return this.http.post<Array<PlanningMedicalTurnModel>>(`${environment.apiUrl}/${this.modelClass.getGQLCrudName()}/progMedicalCalendar`, request);
  }

  public progMedicalTurnCalendar(periodId: string, medicalOfficeId: string): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/${this.modelClass.getGQLCrudName()}/progMedicalCalendar/${periodId}/${medicalOfficeId}`);
  }

  public findByProgrammingDetail(id: string): Observable<any> {

    return this.http.get<any>(`${environment.apiUrl}/${this.modelClass.getGQLCrudName()}/findByProgrammingDetail/${id}`);
  }

  public programmingDoctorForDayList(): Observable<Array<any>> {
    return this.http.get<Array<any>>(`${environment.apiUrl}/${this.modelClass.getGQLCrudName()}/programmingDoctorForDayList`);
  }

  public programmingDoctorForDayProcedureList(): Observable<Array<any>> {
    return this.http.get<Array<any>>(`${environment.apiUrl}/${this.modelClass.getGQLCrudName()}/programmingDoctorForDayProcedureList`);
  }

  public findProgrammingCouponAvailableSales(filters: any): Observable<Array<any>> {

    let params = new HttpParams()
      .set('q', btoa(JSON.stringify(filters)));

    return this.http.get<Array<any>>(`${environment.apiUrl}/${this.modelClass.getGQLCrudName()}/searchingTurnAvailabes`, { params: params });
  }
}
