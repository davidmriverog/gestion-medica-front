import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { BaseService, IContextService } from '../../../exports/lib';
import { environment } from '../../../../environments/environment';

import { SysUserModel } from '../../models/sys/sys-user.model';

@Injectable({
  providedIn: 'root'
})
export class SysUserService extends BaseService {

  constructor(private http: HttpClient, private contextService: IContextService) {
    super(http, contextService)

    this.modelClass = SysUserModel;
  }

  lockedUser(id: string, action: boolean): Observable<any> {
    return this.http.put<any>(`${environment.apiUrl}/${this.modelClass.getGQLCrudName()}/lockedUser/${id}`, {
      action: action
    });
  }

  updateDoctor(userId: string, payload: { doctorId: string, doctor: any }): Observable<any> {
    return this.http.put<any>(`${environment.apiUrl}/${this.modelClass.getGQLCrudName()}/update-doctor/${userId}`, payload);
  }
}
