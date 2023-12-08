import { CoreBaseModel, GQLCrudName } from '../../../exports/lib';

@GQLCrudName({
  name: 'document-types'
})
export class DocumentTypeModel extends CoreBaseModel {

  name: string;
  code: string;
  mask: string;
  createdAt: Date;
}