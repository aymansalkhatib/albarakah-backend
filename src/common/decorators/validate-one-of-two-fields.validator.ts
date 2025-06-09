import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  registerDecorator,
  ValidationOptions,
} from 'class-validator';

type InvalidField = [string, string];

interface FieldGroup {
  fields: InvalidField;
  isRequired: boolean;
}

@ValidatorConstraint({ name: 'OnlyOneOf', async: false })
export class OnlyOneOfConstraint implements ValidatorConstraintInterface {
  private invalidGroup: FieldGroup[] = [];

  validate(_: any, args: ValidationArguments): boolean {
    const object = args.object as any;
    const fieldGroups = args.constraints[0] as FieldGroup[];

    this.invalidGroup = [];

    for (const group of fieldGroups) {
      const { fields, isRequired } = group;

      const definedFields = fields.filter(
        (field) => object[field] !== undefined && object[field] !== null && object[field] !== '',
      );

      if (isRequired) {
        // Must provide exactly one field from the group
        if (definedFields.length !== 1) {
          this.invalidGroup.push(group);
        }
      } else {
        // Optional: can provide 0, 1, or 2 fields (but if providing, only one is allowed)
        if (definedFields.length > 1) {
          this.invalidGroup.push(group);
        }
      }
    }

    return this.invalidGroup.length === 0;
  }

  defaultMessage(_: ValidationArguments): string {
    let messages: string[] = [];

    this.invalidGroup.forEach((group) => {
      if (group.isRequired) {
        messages.push(
          `You must provide exactly one of the following fields: ${group.fields.join(', ')}`,
        );
      } else {
        messages.push(
          `You can provide at most one of the following fields: ${group.fields.join(', ')}`,
        );
      }
    });

    return messages.join(', ');
  }
}

export function OnlyOneOf(fieldGroups: FieldGroup[], validationOptions?: ValidationOptions) {
  return function (constructor: Function) {
    registerDecorator({
      name: 'OnlyOneOf',
      target: constructor,
      options: validationOptions,
      constraints: [fieldGroups],
      validator: OnlyOneOfConstraint,
      propertyName: undefined!,
    });
  };
}
