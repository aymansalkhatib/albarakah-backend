import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreateDropdownDto } from './create-dropdown.dto';

export class UpdateDropdownDto extends PartialType(
  OmitType(CreateDropdownDto, ['dropdownCategoryId'] as const),
) {}
