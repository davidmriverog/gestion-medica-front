import { CoreBaseModel, GQLCrudName } from '../../../exports/lib';

@GQLCrudName({
  name: 'medicines'
})
export class MedicineModel extends CoreBaseModel {

  name: string;
  code: string;
  concentration: string;
  description: string;
  createdAt: Date;

  fullName?: string;
}