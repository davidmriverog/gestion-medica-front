import { CoreBaseModel, GQLCrudName } from '../../../exports/lib';

@GQLCrudName({
  name: 'roles'
})
export class SysRoleModel extends CoreBaseModel {
  name: string;
  code: string;
  description: string;
  createdAt: Date;
}