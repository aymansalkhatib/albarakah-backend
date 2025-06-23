import {
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { FilterPersonDto } from '../../persons/dto/filter-person.dto';
import { IsAfterDate } from '../../../common/decorators/is-after-date.decorator';
import { FamilyRelationType } from '../../beneficiary-families/enums/family-relation-type.enum';

export class FilterGuardianDto {
  @IsOptional()
  @IsEnum(FamilyRelationType)
  relationType?: FamilyRelationType;

  @IsOptional()
  @IsDateString()
  guardianshipStartDateFrom?: string;

  @IsOptional()
  @IsDateString()
  @IsAfterDate('guardianshipStartDateFrom')
  guardianshipStartDateTo?: string;

  @IsOptional()
  @IsDateString()
  guardianshipEndDateFrom?: string;

  @IsOptional()
  @IsDateString()
  @IsAfterDate('guardianshipEndDateFrom')
  guardianshipEndDateTo?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  search?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => FilterPersonDto)
  person?: FilterPersonDto;
}
