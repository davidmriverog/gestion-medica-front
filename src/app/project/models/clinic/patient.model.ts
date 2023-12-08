import { CoreBaseModel, GQLCrudName } from '../../../exports/lib';

@GQLCrudName({
  name: 'patients'
})
export class PatientModel extends CoreBaseModel {

  firstName: string;
  firstSurname: string;
  secondSurname: string;
  birthDate: Date;
  gender: string;
  documentTypeId: string;
  documentNumber: string;
  otherDocument: string;
  emailAddress: string;
  phone: string;
  cellphone: string;
  addresses: string;
  historyNumber: string;
  active: boolean;
  createdAt: Date;

  isOwner: boolean;
  patientParentOwnerId?: string;

  fullName?: string;
}