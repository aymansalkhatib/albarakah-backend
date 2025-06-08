import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  registerDecorator,
  ValidationOptions,
} from 'class-validator';

@ValidatorConstraint({ name: 'OnlyOneOf', async: false })
export class OnlyOneOfConstraint implements ValidatorConstraintInterface {
  validate(_: any, args: ValidationArguments): boolean {
    const object = args.object as any;
    const fields = args.constraints as string[];

    const definedFields = fields.filter(
      (field) => object[field] !== undefined && object[field] !== null,
    );

    return definedFields.length === 1;
  }

  defaultMessage(args: ValidationArguments): string {
    const fields = args.constraints as string[];
    return `You must provide exactly one of the following fields: ${fields.join(', ')}.`;
  }
}
export function OnlyOneOf(fields: string[], validationOptions?: ValidationOptions) {
  return function (constructor: Function) {
    registerDecorator({
      name: 'OnlyOneOf',
      target: constructor,
      options: validationOptions,
      constraints: fields,
      validator: OnlyOneOfConstraint,
      propertyName: undefined!,
    });
  };
}
