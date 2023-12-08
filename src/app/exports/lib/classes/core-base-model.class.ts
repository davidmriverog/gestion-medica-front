import { GQL_NAME_ENPOINT } from "../decorators/crud-endpoint.decorator";

export class CoreBaseModel {

  _id: string;

  public static apiEndpoint = '';

  public static getPropertyIdentityName = '_id';

  getIdentity() {
    return this._id;
  }

  setIdentity(value: any) {
    this._id = value;
  }

  public static getGQLCrudName() {
    const key = Reflect.getMetadata(GQL_NAME_ENPOINT, this, GQL_NAME_ENPOINT);

    return key;
  }
}
