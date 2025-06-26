import { applyDecorators } from '@nestjs/common';
import { Transform, Type } from 'class-transformer';
import { IsArray, IsInt, IsNotEmpty, Min, ValidateNested } from 'class-validator';

export function PositiveIntegerIdArray({ nullable = false }: { nullable?: boolean } = {}) {
  return applyDecorators(
    Transform(({ obj, key }) => {
      const value = obj[key];
      if (value === null || value === undefined || value === '' || value === 'null') {
        return nullable ? null : undefined;
      }

      // Handle string input (comma-separated values)
      if (typeof value === 'string') {
        return value
          .split(',')
          .map((v) => {
            const num = Number(v.trim());
            return isNaN(num) ? undefined : num;
          })
          .filter((v) => v !== undefined);
      }

      // Handle array input
      if (Array.isArray(value)) {
        return value
          .map((v) => {
            const num = Number(v);
            return isNaN(num) ? undefined : num;
          })
          .filter((v) => v !== undefined);
      }

      return undefined;
    }),
    IsArray({ message: 'Must be an array' }),
    IsNotEmpty({ each: true, message: 'Each ID must not be empty' }),
    IsInt({ each: true, message: 'Each ID must be an integer' }),
    Min(1, { each: true, message: 'Each ID must be a positive integer greater than 0' }),
  );
}
