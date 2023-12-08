import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { Observable, of, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { catchError, delay, finalize, map, mergeMap, retryWhen, tap } from 'rxjs/operators';
import { BaseService, IAPIRecords, IContextService } from '../../../exports/lib';

import { SaleModel } from '../../models/sm/sale.model';

@Injectable({
  providedIn: 'root'
})
export class SaleService extends BaseService {

  constructor(private http: HttpClient, private contextService: IContextService) {
    super(http, contextService);

    this.modelClass = SaleModel;
  }

  public listPaginateHistoryClient(attrs: any): Observable<IAPIRecords<any[]>> {

    let params = new HttpParams()
      .set('q', btoa(JSON.stringify(attrs)));

    return this.http.get<IAPIRecords<any[]>>(`${environment.apiUrl}/${this.modelClass.getGQLCrudName()}/listPaginateHistoryClient`, { params: params });
  }

  public indicatorDashboardSales(): Observable<any> {

    return this.http.get<any>(`${environment.apiUrl}/${this.modelClass.getGQLCrudName()}/indicatorDashboardSales`);
  }

  public info(saleId: string): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/${this.modelClass.getGQLCrudName()}/info/${saleId}`);
  }

  public print(saleId: string): Observable<any> {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('charset', 'utf8');

    return this.http.post(`${environment.apiUrl}/${this.modelClass.getGQLCrudName()}/print/${saleId}`, {}, { headers: headers, responseType: 'blob' }).pipe(
      map((response: any) => response),
      catchError(error => throwError(error))
    );
  }

  public annulment(saleId: string): Observable<any> {

    return this.http.delete<any>(`${environment.apiUrl}/${this.modelClass.getGQLCrudName()}/annulment/${saleId}`).pipe(
      retryWhen(errors => {
        return errors.pipe(
          delay(500),
          mergeMap((error, index) => {
            console.log(`[${index}] - Intento...`, error);

            if (index === 4) {

              return throwError(error);
            } else {
              return of(error);
            }

          })
        );
      })
    );
  }
}
