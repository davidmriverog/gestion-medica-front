import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, mergeMap, retryWhen, tap } from 'rxjs/operators';

import { BaseService, IContextService } from '../../../exports/lib';

import { environment } from '../../../../environments/environment';
import { MedicineModel } from '../../models/clinic/medicine.model';

@Injectable({
  providedIn: 'root'
})
export class MedicineService extends BaseService {

  constructor(private http: HttpClient, private contextService: IContextService) {
    super(http, contextService);

    this.modelClass = MedicineModel;
  }

  searching(query: string): Observable<Array<MedicineModel>> {

    let params = new HttpParams()
      .set('query', query);

    return this.http.get<Array<MedicineModel>>(`${environment.apiUrl}/${this.modelClass.getGQLCrudName()}/searching`, { params }).pipe(
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
