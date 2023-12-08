import { CoreBaseModel, GQLCrudName } from '../../../exports/lib';
import { SpecialityModel } from '../clinic/speciality.model';

@GQLCrudName({
  name: 'staffs'
})
export class StaffModel extends CoreBaseModel {

  firstName: string;
  lastName: string;
  documentTypeId: string;
  companyId: string;
  specialityId: string;
  documentNumber: string;
  birthDate: Date;
  gender: string;
  emailAddress: string;
  cellphone: string;
  addresses: string;
  active: boolean;
  createdAt: Date;

  specialty?: SpecialityModel;
}