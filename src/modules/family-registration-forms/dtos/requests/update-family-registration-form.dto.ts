import { UpdateFamilyDto } from '../../../families/dtos/requests/update-family-dto';
import { UpdateFamilyMemberDto } from '../../../family-members/dtos/requests/update-family-member.dto';
import { UpdateGuardianDto } from '../../../guardians/dtos/requests/update-guardian.dto';
import { UpdateHouseDto } from '../../../houses/dtos';
import { OmitType, PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, IsNotEmpty, IsOptional, ValidateNested } from 'class-validator';
import { CreateFamilyRegistrationFormDto } from './create-family-registration-form.dto';

export class UpdateFamilyRegistrationFormDto extends OmitType(
  PartialType(CreateFamilyRegistrationFormDto),
  ['familyMembers', 'guardians', 'family', 'house'],
) {
  @IsNotEmpty()
  @Type(() => UpdateFamilyDto)
  family: UpdateFamilyDto;

  @IsNotEmpty()
  @IsOptional()
  @Type(() => UpdateHouseDto)
  house?: UpdateHouseDto;

  @IsNotEmpty()
  @Type(() => UpdateGuardianDto)
  guardians: UpdateGuardianDto;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => UpdateFamilyMemberDto)
  familyMembers: UpdateFamilyMemberDto[];
}
