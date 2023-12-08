import { CoreBaseModel, GQLCrudName } from '../../../exports/lib';

@GQLCrudName({
  name: 'resources'
})
export class SysResourceModel extends CoreBaseModel {
  name: string;
  code: string;
  createdAt: Date;
}