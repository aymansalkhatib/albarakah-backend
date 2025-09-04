import { Type } from 'class-transformer';
import { IsOptional, ValidateNested } from 'class-validator';
import { UpdateFamilyDto } from '../../../families/dtos/requests/update-family-dto';
import { UpdateFamilyMemberDto } from '../../../family-members/dtos/requests/update-family-member.dto';

export class UpdateInterviewDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateFamilyDto)
  family?: UpdateFamilyDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateFamilyMemberDto)
  guardian?: UpdateFamilyMemberDto;
}
