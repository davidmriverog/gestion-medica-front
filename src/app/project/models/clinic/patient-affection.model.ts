import { CoreBaseModel, GQLCrudName } from '../../../exports/lib';

@GQLCrudName({
  name: 'patient-affections'
})
export class PatientAffectionModel extends CoreBaseModel {

  patientId: string;
  name: string;
  type: string;
  description: string;

  createdAt: Date;
}
