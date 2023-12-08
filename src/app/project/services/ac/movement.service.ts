import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { BaseService, CoreBaseModel, IContextService } from '../../../exports/lib';
import { MovementModel } from '../../models/ac/movement.model';

@Injectable({
  providedIn: 'root'
})
export class MovementService extends BaseService {

  constructor(private http: HttpClient, private contextService: IContextService) {
    super(http, contextService)

    this.modelClass = MovementModel;
  }

  public currentBalance(periodId: string): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/${this.modelClass.getGQLCrudName()}/balance/${periodId}`);
  }
}
