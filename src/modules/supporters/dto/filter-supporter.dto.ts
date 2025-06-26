import {
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { IsAfterDate } from '../../../common/decorators/is-after-date.decorator';
import { SupportType } from '../enums/support-type';
import { FilterPersonDto } from '@app/modules/persons/dtos/queries/filter-person.dto';

export class FilterSupporterDto {
  @IsOptional()
  @IsEnum(SupportType)
  supportType?: SupportType;

  @IsOptional()
  @IsDateString()
  supportStartDateFrom?: string;

  @IsOptional()
  @IsDateString()
  @IsAfterDate('supportStartDateFrom')
  supportStartDateTo?: string;

  @IsOptional()
  @IsDateString()
  supportEndDateFrom?: string;

  @IsOptional()
  @IsDateString()
  @IsAfterDate('supportEndDateFrom')
  supportEndDateTo?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  search?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => FilterPersonDto)
  person?: FilterPersonDto;
}
