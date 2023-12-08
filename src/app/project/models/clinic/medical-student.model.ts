import { CoreBaseModel, GQLCrudName } from '../../../exports/lib';

@GQLCrudName({
  name: 'medical-students'
})
export class MedicalStudentModel extends CoreBaseModel {

  name: string;
  code: string;
  description: string;
  createdAt: Date;
  fullName?: string;
}