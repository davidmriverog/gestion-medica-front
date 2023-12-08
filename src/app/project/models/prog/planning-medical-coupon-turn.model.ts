import { CoreBaseModel, GQLCrudName } from '../../../exports/lib';

@GQLCrudName({
  name: 'planning-medical-coupon-turns'
})
export class PlanningMedicalCouponTurnModel extends CoreBaseModel {

  planningMedicalTurnId: string;
  planningTurnStatusId: string;
  title: string;
  dateAttention: Date;
  start: string;
  end: string;
  isConfirmed: boolean;
  confirmedDate: Date;
  createdAt: Date;
  deleted: boolean;
}