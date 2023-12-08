import { CoreBaseModel, GQLCrudName } from '../../../exports/lib';

@GQLCrudName({
  name: "tax-conditions"
})
export class TaxConditionModel extends CoreBaseModel {

  name: string;
  code: string;
  createdAt: Date;
}