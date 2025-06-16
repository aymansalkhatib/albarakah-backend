import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateGuardianDto } from './create-guardian.dto';
import { Type } from 'class-transformer';
import { IsOptional, ValidateNested } from 'class-validator';
import { UpdatePersonDto } from 'src/modules/persons/dto/update-person.dto';

export class UpdateGuardianDto extends PartialType(
  OmitType(CreateGuardianDto, ['person', 'personId'] as const),
) {
  @IsOptional()
  @ValidateNested()
  @Type(() => UpdatePersonDto)
  person?: UpdatePersonDto;
}
