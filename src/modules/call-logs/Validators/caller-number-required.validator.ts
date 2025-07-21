import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';
import { CallerTypeEnum } from '../enums/caller-type.enum';

@ValidatorConstraint({ name: 'isCallerNumberRequired', async: false })
export class IsCallerNumberRequired implements ValidatorConstraintInterface {
  validate(callerNumber: string, args: ValidationArguments) {
    const object = args.object as any;
    const callerType = object.callerType;
    
    if (callerType === CallerTypeEnum.SUPPORTER || callerType === CallerTypeEnum.FAMILY_MEMBER) {
      return !!callerNumber; // Required for these types
    }
    
    return true; // Optional for 'other' type
  }

  defaultMessage(args: ValidationArguments) {
    return 'Caller number is required for supporter and family member types';
  }
}