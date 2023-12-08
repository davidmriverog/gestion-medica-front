import { CoreBaseModel, GQLCrudName } from '../../../exports/lib';

@GQLCrudName({
  name: "accounting-periods"
})
export class AccountingPeriodModel extends CoreBaseModel {

  name: string;
  startDate: Date;
  endDate: Date;
  accountingPeriodParentId: Date;
  initBalance: number;
  isOpened: boolean;
  observation: string;
  createdAt: Date;
}