import { applyDecorators } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { IsOptional, IsInt, Min, IsNotEmpty } from 'class-validator';

export function PositiveIntegerId({ nullable = false }: { nullable?: boolean } = {}) {
  return applyDecorators(
    Transform(({ obj, key }) => {
      const value = obj[key];
      if (value === null || value === undefined || value === '' || value === 'null') {
        return nullable ? null : undefined;
      }
      const num = Number(value);
      return isNaN(num) ? undefined : num;
    }),
    IsNotEmpty(),
    IsInt({ message: 'ID must be an integer' }),
    Min(1, { message: 'ID must be a positive integer greater than 0' }),
  );
}
