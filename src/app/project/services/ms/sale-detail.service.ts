import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

import { BaseService, IContextService } from '../../../exports/lib';

import { SaleDetailModel } from '../../models/sm/sale-detail.model';

@Injectable({
  providedIn: 'root'
})
export class SaleDetailService extends BaseService {

  constructor(private http: HttpClient, private contextService: IContextService) {
    super(http, contextService);

    this.modelClass = SaleDetailModel;
  }

  public getInfoByDetail(detailId: string): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/${SaleDetailModel.getGQLCrudName()}/getInfoByDetail/${detailId}`);
  }
}
