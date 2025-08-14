import { PartialType } from '@nestjs/mapped-types';
import { CreateFamilyRegistrationFormDto } from './create-family-registration-form.dto';

export class UpdateFamilyRegistrationFormDto extends PartialType(CreateFamilyRegistrationFormDto) {}
