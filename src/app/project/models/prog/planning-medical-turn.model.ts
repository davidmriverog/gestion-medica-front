import { CoreBaseModel, GQLCrudName } from '../../../exports/lib';
import { AccountingPeriodModel } from '../ac/accounting-period.model';

@GQLCrudName({
  name: 'planning-medical-turns'
})
export class PlanningMedicalTurnModel extends CoreBaseModel {

  accountingPeriodId: string;

  doctorId: string;
  specialityId: string;
  productCategoryId: string;
  medicalOfficeId: string;
  attentionDate: Date;
  createdAt: Date;
  deleted: boolean;
  active: boolean;

  period?: AccountingPeriodModel;
}