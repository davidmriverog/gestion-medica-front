import { CoreBaseModel, GQLCrudName } from '../../../exports/lib';

@GQLCrudName({
  name: 'specialities'
})
export class SpecialityModel extends CoreBaseModel {

  name: string;
  code: string;
  times: number;
  color: string;
  description: string;
  createdAt: Date;

  active: boolean;
}