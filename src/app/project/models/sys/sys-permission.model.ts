import { CoreBaseModel, GQLCrudName } from '../../../exports/lib';

@GQLCrudName({
  name: 'permissions'
})
export class SysPermissionModel extends CoreBaseModel {
  name: string;
  code: string;
  resourceId: string;
  createdAt: Date;
}