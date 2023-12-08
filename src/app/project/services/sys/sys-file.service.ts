import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { BaseService, IContextService } from '../../../exports/lib';

import { SysFileModel } from '../../models/sys/sys-file.model';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SysFileService extends BaseService {

  constructor(private http: HttpClient, private contextService: IContextService) {
    super(http, contextService);

    this.modelClass = SysFileModel;
  }

  public download(fileId: string): Observable<any> {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('charset', 'utf8');

    return this.http.get(`${environment.apiUrl}/${this.modelClass.getGQLCrudName()}/download/${fileId}`, { headers: headers, responseType: 'blob' }).pipe(
      map((response: any) => response),
      catchError(error => throwError(error))
    );
  }
}
