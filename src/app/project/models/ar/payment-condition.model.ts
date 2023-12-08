import { CoreBaseModel, GQLCrudName } from '../../../exports/lib';

@GQLCrudName({
  name: "payment-conditions"
})
export class PaymentConditionModel extends CoreBaseModel {
  name: string;
  code: string;
  isCommission: boolean;
  percentageCommission: number;
  createdAt: Date;
  active: boolean;  
}