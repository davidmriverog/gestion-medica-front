import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { BaseService, CoreBaseModel, IContextService } from '../../../exports/lib';
import { AccountingPeriodModel } from '../../models/ac/accounting-period.model';

@Injectable({
  providedIn: 'root'
})
export class AccountingPeriodService extends BaseService {

  constructor(private http: HttpClient, private contextService: IContextService) {
    super(http, contextService)

    this.modelClass = AccountingPeriodModel;
  }

  public currentAccount(accountingPeriodId: string): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/${this.modelClass.getGQLCrudName()}/currentAccount/${accountingPeriodId}`);
  }

  public accountingPeriodClosing(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/${this.modelClass.getGQLCrudName()}/accountingPeriodClosing`, {});
  }

  public closePeriod(periodId: string): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/${this.modelClass.getGQLCrudName()}/closeAccountingPeriod/${periodId}`, {});
  }
}
