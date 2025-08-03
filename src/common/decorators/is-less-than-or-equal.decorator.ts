import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator';

export function IsLessThanOrEqual(property: string, validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isLessThanOrEqual',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as any)[relatedPropertyName];

          if (value == null || relatedValue == null) return true;

          return typeof value === 'number' && typeof relatedValue === 'number'
            ? value <= relatedValue
            : new Date(value) <= new Date(relatedValue);
        },
        defaultMessage: (args: ValidationArguments) => {
          const [relatedPropertyName] = args.constraints;
          return `${args.property} must be less than or equal to ${relatedPropertyName}`;
        },
      },
    });
  };
}
