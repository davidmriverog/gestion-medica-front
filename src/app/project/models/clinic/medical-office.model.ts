import { CoreBaseModel, GQLCrudName } from '../../../exports/lib';

@GQLCrudName({
  name: 'medical-offices'
})
export class MedicalOfficeModel extends CoreBaseModel {

  officeName: string;
  officeNumber: string;
  address: string;
  startAttentionDayId: string;
  endAttentionDayId: string;
  allWeek: boolean;
  phone: string;
  observation: string;
  active: boolean;
  createdAt: Date;
}