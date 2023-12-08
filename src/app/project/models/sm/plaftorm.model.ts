import { CoreBaseModel, GQLCrudName } from '../../../exports/lib';

@GQLCrudName({
  name: "platforms"
})
export class PlatformModel extends CoreBaseModel {

  name: string;
  code: string;
  createdAt: Date;
}