import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateFamilyMemberDto } from './create-family-member.dto';
import { UpdatePersonDto } from '../../../../modules/persons/dtos/requests/update-person.dto';
import { Type } from 'class-transformer';
import { IsOptional, ValidateNested } from 'class-validator';

export class UpdateFamilyMemberDto extends PartialType(
  OmitType(CreateFamilyMemberDto, ['person', 'personId', 'familyId']),
) {
  @IsOptional()
  @ValidateNested()
  @Type(() => UpdatePersonDto)
  person?: UpdatePersonDto;
}
