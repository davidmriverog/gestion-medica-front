import { CoreBaseModel, GQLCrudName, UIFileInterface } from '../../../exports/lib';
import { CurrencyModel } from '../ac/currency.model';

@GQLCrudName({
  name: "client-info"
})
export class ClientInfoModel extends CoreBaseModel {

  businessName: string;
  businessNumber: string
  legalRepresentative: string;
  address: string;
  countryName: string;
  currencyId: string;
  taxeName: string;
  taxeValue: number;
  email: string;
  phoneOne: string;
  phoneTwo?: string;
  createdAt: Date;

  logoImg?: UIFileInterface;
  currency?: CurrencyModel;
}