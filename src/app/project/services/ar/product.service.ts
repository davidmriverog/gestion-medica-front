import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { BaseService, CoreBaseModel, IContextService } from '../../../exports/lib';

import { ProductModel } from '../../models/ar/product.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService extends BaseService {

  constructor(private http: HttpClient, private contextService: IContextService) {
    super(http, contextService)

    this.modelClass = ProductModel;
  }

  public productListBySpecialityId(specialityId: string): Observable<Array<ProductModel>> {
    return this.http.get<Array<ProductModel>>(`${environment.apiUrl}/${this.modelClass.getGQLCrudName()}/allProductBySpeciality/${specialityId}`);
  }
}
