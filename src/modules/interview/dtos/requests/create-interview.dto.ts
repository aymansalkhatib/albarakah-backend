import { Type } from 'class-transformer';
import { IsNotEmpty, ValidateNested } from 'class-validator';
import { CreateFamilyDto } from '../../../families/dtos/requests/create-family-dto';
import { CreateFamilyMemberDto } from '../../../family-members/dtos/requests/create-family-member.dto';

export class CreateInterviewDto {
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CreateFamilyDto)
  family: CreateFamilyDto;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CreateFamilyMemberDto)
  guardian: CreateFamilyMemberDto;
}
