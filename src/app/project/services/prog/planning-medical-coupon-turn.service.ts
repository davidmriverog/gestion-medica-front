import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { BaseService, IAPIRecords, IContextService } from '../../../exports/lib';
import { environment } from '../../../../environments/environment';

import { PlanningMedicalCouponTurnModel } from '../../models/prog/planning-medical-coupon-turn.model';

@Injectable({
  providedIn: 'root'
})
export class PlanningMedicalCouponTurnService extends BaseService {

  constructor(private http: HttpClient, private contextService: IContextService) {
    super(http, contextService);

    this.modelClass = PlanningMedicalCouponTurnModel;
  }

  public listPaginateHistory(attrs: any): Observable<IAPIRecords<any[]>> {

    let params = new HttpParams()
      .set('q', btoa(JSON.stringify(attrs)));

    return this.http.get<IAPIRecords<any[]>>(`${environment.apiUrl}/${this.modelClass.getGQLCrudName()}/listPaginateHistory`, { params: params });
  }

  public listCouponEventByAttentionDate(date: string): Observable<Array<any>> {

    let params = new HttpParams()
      .set('date', date);

    return this.http.get<Array<any>>(`${environment.apiUrl}/${this.modelClass.getGQLCrudName()}/listCouponEventByAttentionDate`, { params: params });
  }

  public searchCouponSalesDetail(filters: any): Observable<Array<any>> {

    let params = new HttpParams()
      .set('q', btoa(JSON.stringify(filters)));

    return this.http.get<Array<any>>(`${environment.apiUrl}/${this.modelClass.getGQLCrudName()}/searchCouponSalesDetail`, { params: params });
  }

  public listCouponByMedicalOfficeAndDates(filters: any): Observable<Array<any>> {

    let params = new HttpParams()
      .set('q', btoa(JSON.stringify(filters)));

    return this.http.get<Array<any>>(`${environment.apiUrl}/${this.modelClass.getGQLCrudName()}/listCouponByMedicalOfficeAndDates`, { params: params });
  }

  public dashboarIndicatordDoctor(): Observable<any> {

    return this.http.get<any>(`${environment.apiUrl}/${this.modelClass.getGQLCrudName()}/dashboarIndicatordDoctor`);
  }

  public dashboarIndicatorAttentionAdmin(): Observable<any> {

    return this.http.get<any>(`${environment.apiUrl}/${this.modelClass.getGQLCrudName()}/dashboarIndicatorAttentionAdmin`);
  }

  public attentionListOfDayByDoctor(doctorId: string): Observable<any> {
    let params = new HttpParams()
      .set('doctorId', doctorId);

    return this.http.get<any>(`${environment.apiUrl}/${this.modelClass.getGQLCrudName()}/attentionListOfDayByDoctor`, { params: params });
  }

  public listCouponAvaibleReprogramming(doctorId: string, planningMedicalCouponTurnId: string, productCategoryId: string): Observable<Array<any>> {

    let params = new HttpParams()
      .set('planningMedicalCouponTurnId', planningMedicalCouponTurnId)
      .set('doctorId', doctorId)
      .set('productCategoryId', productCategoryId);

    return this.http.get<Array<any>>(`${environment.apiUrl}/${this.modelClass.getGQLCrudName()}/listCouponAvaibleReprogramming`, { params: params });
  }

  public reProgrammingMedicalTurn(attrs: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/${this.modelClass.getGQLCrudName()}/reProgrammingMedicalTurn`, attrs);
  }
}
