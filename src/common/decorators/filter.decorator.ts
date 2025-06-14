import 'reflect-metadata';

export interface FilterOptions {
  type: string;
  required?: boolean;
  validation?: any;
}

export function Filter(options: string | FilterOptions) {
  return function (target: any, propertyKey: string) {
    const filterData = typeof options === 'string' ? { type: options } : options;
    Reflect.defineMetadata('filter', filterData, target, propertyKey);
  };
}
