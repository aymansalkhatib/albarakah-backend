import 'reflect-metadata';

export interface FilterMetadata {
  value: any;
  filter: any;
}

export interface FilterMetadataMap {
  [key: string]: FilterMetadata;
}

export function getFilterMetadata<T>(filterDto: T, dtoClass: new () => T): FilterMetadataMap {
  const metadata: FilterMetadataMap = {};
  const prototype = dtoClass.prototype;

  const allKeys = Object.keys(filterDto);

  allKeys.forEach((propName) => {
    if (propName === 'constructor') return;

    const value = filterDto[propName];

    if (value && typeof value === 'object' && !Array.isArray(value) && !(value instanceof Date)) {
      const nestedKeys = Object.keys(value);
      nestedKeys.forEach((nestedPropName) => {
        const nestedValue = value[nestedPropName];

        // الحصول على filter type للحقل المتداخل
        const nestedFilterType = Reflect.getMetadata(
          'filter',
          value.constructor.prototype,
          nestedPropName,
        );

        const finalPropName = `${propName}.${nestedPropName}`;

        metadata[finalPropName] = {
          value: nestedValue,
          filter: nestedFilterType || null,
        };
      });

      return;
    }

    const filterType = Reflect.getMetadata('filter', prototype, propName);

    metadata[propName] = {
      value: value,
      filter: filterType || null,
    };
  });

  return metadata;
}
