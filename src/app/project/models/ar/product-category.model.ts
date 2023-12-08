import { CoreBaseModel, GQLCrudName } from '../../../exports/lib';

@GQLCrudName({
  name: "product-categories"
})
export class ProductCategoryModel extends CoreBaseModel {

  name: string;
  code: string;
  createdAt: Date;
}