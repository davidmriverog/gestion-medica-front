import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, mergeMap, retryWhen, tap } from 'rxjs/operators';

import { BaseService, IContextService } from '../../../exports/lib';

import { environment } from '../../../../environments/environment';
import { MedicalStudentModel } from '../../models/clinic/medical-student.model';

@Injectable({
  providedIn: 'root'
})
export class MedicalStudentService extends BaseService {

  constructor(private http: HttpClient, private contextService: IContextService) {
    super(http, contextService);

    this.modelClass = MedicalStudentModel;
  }

  searching(query: string): Observable<Array<MedicalStudentModel>> {

    let params = new HttpParams()
      .set('query', query);

    return this.http.get<Array<MedicalStudentModel>>(`${environment.apiUrl}/${MedicalStudentModel.getGQLCrudName()}/searching`, { params }).pipe(
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
