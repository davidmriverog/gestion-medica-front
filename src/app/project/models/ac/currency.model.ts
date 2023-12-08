import { CoreBaseModel, GQLCrudName } from '../../../exports/lib';

@GQLCrudName({
  name: "currencies"
})
export class CurrencyModel extends CoreBaseModel {
  name: string;
  code: string;
  symbol: string;
  createdAt: Date;
  active: boolean;
}