import { CoreBaseModel, GQLCrudName } from '../../../exports/lib';

@GQLCrudName({
  name: "sales-details"
})
export class SaleDetailModel extends CoreBaseModel {

  saleId: string;
  productId: string;
  planningMedicalCouponTurnId: string;
  isAttended: boolean;
  medicalActId: string;
  amount: number;
  createdAt: Date;
  deleted: boolean;
}