import { CoreBaseModel, GQLCrudName } from '../../../exports/lib';

@GQLCrudName({
  name: "files"
})
export class SysFileModel extends CoreBaseModel {

  filename: string;
  mimeType: string;
  extension: string;
  createdAt: Date;
  deleted: boolean;
}