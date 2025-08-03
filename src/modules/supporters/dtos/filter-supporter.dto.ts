import {
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { IsLessThanOrEqual } from '../../../common/decorators/is-less-than-or-equal.decorator';
import { SupportType } from '../enums/support-type';
import { FilterPersonDto } from '@app/modules/persons/dtos/queries/filter-person.dto';
import { PaginationDto } from '@app/common/pagination/dto/pagination.dto';

export class FilterSupporterDto extends PaginationDto {
  @IsOptional()
  @IsEnum(SupportType)
  supportType?: SupportType;

  @IsOptional()
  @IsDateString()
  supportStartDateFrom?: string;

  @IsOptional()
  @IsDateString()
  @IsLessThanOrEqual('supportStartDateFrom')
  supportStartDateTo?: string;

  @IsOptional()
  @IsDateString()
  supportEndDateFrom?: string;

  @IsOptional()
  @IsDateString()
  @IsLessThanOrEqual('supportEndDateFrom')
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
