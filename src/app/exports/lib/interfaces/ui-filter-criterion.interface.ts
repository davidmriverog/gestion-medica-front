export enum FilterTypesEnum {
  GreatherThan = 'gt',
  GreatherThanEquals = 'gte',
  LowerThan = 'lt',
  LowerThanEquals = 'lte',
  Like = 'like',
  Equals = 'eq',
  NotEquals = 'neq',
  Between = 'between'
}

export enum ElementTypeEnum {
  Text = 'text',
  Number = 'number',
  Dropdown = 'dropdown',
  Date = 'date'
}

export declare type IFilterCriterion = IFilterDefinition & IFilterAnd & IFilterOr;

interface IFilterDefinition {
  type?: FilterTypesEnum;
  property?: string;
  typeValue?: FilterTypeValue;
  value?: any | {
    from: any;
    to: any;
  };
}

interface IFilterAnd {
  and?: Array<IFilterCriterion>;
}

interface IFilterOr {
  or?: Array<IFilterCriterion>;
}

export interface IFilterOptions {
  label: string;
  value: FilterTypesEnum;
}

export interface ISortingCriterion {
  name: string;
  value: 'asc' | 'desc'
}

export enum FilterTypeValue {
  NUMBER = 'number',
  STRING = 'string',
  ID = 'objectId',
  DATE = 'date'
}

export interface IApiCriteria {
  page: number;
  limit: number;
  filters: Array<IFilterCriterion>
}

export interface IAPIRecords<T> {
  page: number;
  limit: number;
  totalRecords: number;
  totalPages: number;
  data: Array<T>
}
