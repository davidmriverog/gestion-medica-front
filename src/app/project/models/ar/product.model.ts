import { CoreBaseModel, GQLCrudName } from '../../../exports/lib';

import { ProductCategoryModel } from './product-category.model';

@GQLCrudName({
  name: "products"
})
export class ProductModel extends CoreBaseModel {

  name: string;
  specialityId: string;
  productCategoryId: string;
  price: number;
  createdAt: Date;

  productCategory?: ProductCategoryModel;
}