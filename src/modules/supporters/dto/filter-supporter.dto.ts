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
import { IsAfterDate } from 'src/common/decorators/is-after-date.decorator';
import { SupportType } from '../enums/support-type';

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
