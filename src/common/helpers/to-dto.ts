import { plainToInstance, ClassConstructor, ClassTransformOptions } from 'class-transformer';

export function toDto<T, V>(
  cls: ClassConstructor<T>,
  plain: V[],
  options?: ClassTransformOptions,
): T[];

export function toDto<T, V>(cls: ClassConstructor<T>, plain: V, options?: ClassTransformOptions): T;

// Implementation
export function toDto<T, V>(
  cls: ClassConstructor<T>,
  plain: V | V[],
  options?: ClassTransformOptions,
): T | T[] {
  return plainToInstance(cls, plain, {
    excludeExtraneousValues: true,
    ...options,
  });
}
