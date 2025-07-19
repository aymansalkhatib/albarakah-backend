import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';

@ValidatorConstraint({ name: 'isValidPhoneNumber', async: false })
export class IsValidPhoneNumber implements ValidatorConstraintInterface {
  validate(phoneNumber: string, args: ValidationArguments) {
    if (!phoneNumber) return true; // Skip validation if empty (handled by other validators)
    
    // Basic phone number validation (adjust regex as needed)
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{8,20}$/;
    return phoneRegex.test(phoneNumber);
  }

  defaultMessage(args: ValidationArguments) {
    return 'Phone number format is invalid';
  }
}