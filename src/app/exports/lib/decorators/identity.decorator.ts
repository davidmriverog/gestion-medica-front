import 'reflect-metadata';
import { CoreBaseModel } from '../classes/core-base-model.class';
import { IDENTITY_META_KEY } from '../contants/meta-constants.constant';

export const Identity = () => {
  return (target: CoreBaseModel, key: string) => {
    Reflect.defineMetadata(IDENTITY_META_KEY, key, target.constructor, IDENTITY_META_KEY);
  };
};
