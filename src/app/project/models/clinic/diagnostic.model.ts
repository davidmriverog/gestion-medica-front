import { CoreBaseModel, GQLCrudName } from '../../../exports/lib';

@GQLCrudName({
  name: 'diagnostics'
})
export class DiagnosticModel extends CoreBaseModel {

  name: string;
  code: string;
  description: string;
  createdAt: Date;

  fullName?: string;
}