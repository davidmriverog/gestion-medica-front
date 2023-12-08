import { CoreBaseModel, GQLCrudName } from '../../../exports/lib';

@GQLCrudName({
  name: "affections"
})
export class AffectionModel extends CoreBaseModel {

  name: string;
  createdAt: Date;
  deleted: boolean;
}