import { FilterDataType, FilterOperator } from '../enums';

export interface BaseFilter {
  field: string;
  operator: FilterOperator;
  value: any;
  dataType?: FilterDataType;
}
