import { CoreBaseModel, GQLCrudName } from '../../../exports/lib';

@GQLCrudName({
  name: "movements"
})
export class MovementModel extends CoreBaseModel {
  accountingPeriodId: string;
  movementCode: string;
  transactionOperationCode: string;
  transactionOperationRefId: string;
  type: string;
  concept: string;
  amount: number;
  createdAt: Date;
}
