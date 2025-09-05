import { Type } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, ValidateNested } from 'class-validator';
import { StrictBoolean } from '../../../../common/decorators/strict-boolean.decorator';
import { PaginationDto } from '../../../../common/pagination/dto/pagination.dto';
import { FilterPersonDto } from '../../../../modules/persons/dtos/queries/filter-person.dto';
import { FamilyRelationType } from '../../enums/family-relation-type.enum';
import { IsPresent } from '../../enums/is-present.enum';

export class FamilyMemberFilterDto extends PaginationDto {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  familyId?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  personId?: number;

  @IsOptional()
  @IsEnum(FamilyRelationType)
  relationType?: FamilyRelationType;

  @IsOptional()
  @StrictBoolean()
  isSponsored?: boolean;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  memberNumber?: number;

  @IsOptional()
  @IsEnum(IsPresent)
  isPresent?: IsPresent;

  @IsOptional()
  @StrictBoolean()
  isGuardian?: boolean;

  @IsOptional()
  @ValidateNested()
  @Type(() => FilterPersonDto)
  person?: FilterPersonDto;
}
