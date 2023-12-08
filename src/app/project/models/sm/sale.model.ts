import { CoreBaseModel, GQLCrudName } from '../../../exports/lib';

@GQLCrudName({
  name: "sales"
})
export class SaleModel extends CoreBaseModel {

  orderSales: string;
  isPatientOwner: boolean;
  patientId: string;
  patientDestinityId: string;
  paymentConditionId: string;
  platformId: string;
  percCommission: number;
  subtotal: number;
  commission: number;
  netAmount: number;
  isPay: boolean;
  createdAt: Date;
  isAnulated: boolean;
}