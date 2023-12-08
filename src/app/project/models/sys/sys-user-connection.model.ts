import { CoreBaseModel, GQLCrudName } from '../../../exports/lib';
import { DoctorModel } from '../clinic/doctor.model';
import { PatientModel } from '../clinic/patient.model';

import { StaffModel } from './staff.model';

@GQLCrudName({
  name: "user-connections"
})
export class SysUserConnectionModel extends CoreBaseModel {

  userId: string;
  doctorId: string;
  staffId: string;
  patientId: string;

  createdAt: Date;

  doctor?: DoctorModel;
  staff?: StaffModel;
  patient?: PatientModel;
}