import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { NgxSpinnerService } from "ngx-spinner";
import { Observable, of, throwError } from "rxjs";
import { delay, finalize, map, mergeMap, retryWhen, tap } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { CoreBaseModel } from "../classes/core-base-model.class";
import { IAPIRecords, IApiCriteria } from "../interfaces/ui-filter-criterion.interface";

@Injectable({
  providedIn: "root"
})
export class SandboxAPIService {

  constructor(private http: HttpClient, private loaderService: NgxSpinnerService) { }

  listPage<T>(useClass: typeof CoreBaseModel, criteria: IApiCriteria): Observable<IAPIRecords<T[]>> {

    const crudName = useClass.getGQLCrudName();

    let params = new HttpParams()
      .set('q', btoa(JSON.stringify(criteria)));

    return this.http.get<IAPIRecords<T[]>>(`${environment.apiUrl}/${crudName}/listPage`, {
      params: params
    }).pipe(
      map((apiRecord) => apiRecord),
      finalize(() => {
        console.log(`[${crudName}] - call listPage`);
      })
    )
  }

  findById<T>(useClass: typeof CoreBaseModel, id: string): Observable<T> {

    const crudName = useClass.getGQLCrudName();

    return this.http.get<T>(`${environment.apiUrl}/${crudName}/${id}`).pipe(
      finalize(() => {
        console.log(`[${crudName}] - call findById`);
      })
    )
  }

  findAll<T>(useClass: typeof CoreBaseModel): Observable<T[]> {

    const crudName = useClass.getGQLCrudName();

    return this.http.get<T[]>(`${environment.apiUrl}/${crudName}`).pipe(
      finalize(() => {
        console.log(`[${crudName}] - call findAll`);
      })
    )
  }

  create<T>(useClass: typeof CoreBaseModel, form: CoreBaseModel): Observable<T> {
    const crudName = useClass.getGQLCrudName();

    this.loaderService.show();

    return this.http.post<T>(`${environment.apiUrl}/${crudName}/create`, form).pipe(
      retryWhen(errors => {
        return errors.pipe(
          delay(500),
          mergeMap((error, index) => {
            console.log(`[${index}] - Intento...`, error);

            if (index === 1) {

              return throwError(error);
            } else {
              return of(error);
            }

          }),
          tap(() => console.log('Reitentando Operación..'))
        );
      }),
      finalize(() => {
        console.log(`[${crudName}] - Call create`)
        this.loaderService.hide();
      })
    );
  }

  update<T>(useClass: typeof CoreBaseModel, id: string, form: CoreBaseModel): Observable<T> {

    const crudName = useClass.getGQLCrudName();

    this.loaderService.show();

    return this.http.put<T>(`${environment.apiUrl}/${crudName}/update/${id}`, form).pipe(
      delay(500),
      retryWhen(errors => {
        return errors.pipe(
          delay(1500),
          mergeMap((error, index) => {
            console.log(`[${index}] - intento...`, error);

            if (index === 1) {

              return throwError(error);
            } else {
              return of(error);
            }

          }),
          tap(() => console.log('Reintentando...'))
        );
      }),
      finalize(() => {
        console.log(`[${crudName}] - Call edit`);
        this.loaderService.hide();
      })
    );
  }

  delete<T>(useClass: typeof CoreBaseModel, id: string): Observable<T> {
    return this.http.delete<T>(`${environment.apiUrl}/${useClass.getGQLCrudName()}/delete/${id}`).pipe(
      delay(500),
      retryWhen(errors => {
        return errors.pipe(
          delay(1500),
          mergeMap((error, index) => {
            console.log(`[${index}] - Intento...`, error);

            if (index === 4) {

              return throwError(error);
            } else {
              return of(error);
            }

          }),
          finalize(() => {
            console.log(`[${useClass.getGQLCrudName()}] - Call remove`);
          })
        );
      })
    );
  }
}
