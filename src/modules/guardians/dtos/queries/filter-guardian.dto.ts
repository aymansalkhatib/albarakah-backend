import { IsEnum, IsOptional, IsString, MaxLength, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { FilterPersonDto } from '../../../../modules/persons/dtos/queries/filter-person.dto';
import { FamilyRelationType } from '../../../../modules/family-members/enums/family-relation-type.enum';
import { PaginationDto } from '../../../../common/pagination/dto/pagination.dto';

export class FilterGuardianDto extends PaginationDto{
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
