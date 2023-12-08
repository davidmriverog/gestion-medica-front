import { CoreBaseModel, GQLCrudName } from '../../../exports/lib';

@GQLCrudName({
  name: 'users'
})
export class SysUserModel extends CoreBaseModel {

  username: string;
  password: string;
  email: string;
  roleId: string;
  active: boolean;
  createdAt: Date;

  fullName?: string;
}