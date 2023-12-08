import { CoreBaseModel, GQLCrudName } from '../../../exports/lib';

@GQLCrudName({
  name: 'doctors'
})
export class DoctorModel extends CoreBaseModel {

  firstName: string;
  secondName: string;
  firstSurname: string;
  secondSurname: string;
  specialityId: string;
  documentTypeId: string;
  documentNumber: string;
  otherDocument: string;
  birthDate: Date;
  gender: string;
  email: string;
  phone: string;
  cellphone: string;
  address: string;
  collegeDegree: string;
  profession: string;
  cmp: string;
  rne: string;
  createdAt: Date;

  fullName?: string;
}