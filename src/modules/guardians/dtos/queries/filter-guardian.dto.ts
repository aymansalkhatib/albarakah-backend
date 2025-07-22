import { IsEnum, IsOptional, IsString, MaxLength, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { FilterPersonDto } from '@app/modules/persons/dtos/queries/filter-person.dto';
import { FamilyRelationType } from '@app/modules/family-members/enums/family-relation-type.enum';

export class FilterGuardianDto {
  @IsOptional()
  @IsEnum(FamilyRelationType)
  relationType?: FamilyRelationType;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  search?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => FilterPersonDto)
  person?: FilterPersonDto;
}
