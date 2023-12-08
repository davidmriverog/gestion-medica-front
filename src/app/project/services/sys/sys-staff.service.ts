import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { BaseService, IContextService } from '../../../exports/lib';
import { environment } from '../../../../environments/environment';

import { StaffModel } from '../../models/sys/staff.model';
import { Observable, of, throwError } from 'rxjs';
import { delay, mergeMap, retryWhen, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SysStaffService extends BaseService {

  constructor(private http: HttpClient, private contextService: IContextService) {
    super(http, contextService);

    this.modelClass = StaffModel;
  }

  searching(query: string): Observable<Array<StaffModel>> {

    let params = new HttpParams()
      .set('query', query);

    return this.http.get<Array<StaffModel>>(`${environment.apiUrl}/${this.modelClass.getGQLCrudName()}/searching`, { params }).pipe(
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
