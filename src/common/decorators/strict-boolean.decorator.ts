// File: strict-boolean.decorator.ts
import { applyDecorators, BadRequestException } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { IsBoolean } from 'class-validator';

interface StrictBooleanOptions {
  default?: boolean;
}

export function StrictBoolean(options?: StrictBooleanOptions) {
  return applyDecorators(
    Transform(({ key, obj }) => {
      const value = obj[key];

      if (value === undefined || value === null || value === '') {
        return options?.default !== undefined ? options.default : undefined;
      }

      if (value === true || value === false) return value;
      if (value === 1 || value === '1' || value === 'true') return true;
      if (value === 0 || value === '0' || value === 'false') return false;

      throw new BadRequestException(
        `Invalid boolean value for ${key}. Only true, false, 1, 0 are allowed.`,
      );
    }),
    IsBoolean(),
  );
}
