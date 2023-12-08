import 'reflect-metadata';

export const GQL_NAME_ENPOINT = "GQL_NAME_ENPOINT";

export function GQLCrudName(val: { name: string }) {
  return function (constructor: any) {
    Reflect.defineMetadata(GQL_NAME_ENPOINT, val.name, constructor, GQL_NAME_ENPOINT);
  };
};


