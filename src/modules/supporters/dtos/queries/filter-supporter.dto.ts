import {
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { FilterPersonDto } from '@app/modules/persons/dtos/queries/filter-person.dto';
import { PaginationDto } from '@app/common/pagination/dto/pagination.dto';
import { IsLessThanOrEqual } from '@app/common/decorators/is-less-than-or-equal.decorator';
import { SupportType } from '../../enums/support-type';

export class FilterSupporterDto extends PaginationDto {
  @IsOptional()
  @IsEnum(SupportType)
  supportType?: SupportType;

  @IsOptional()
  @IsDateString()
  @IsLessThanOrEqual('supportStartDateTo')
  supportStartDateFrom?: Date;

  @IsOptional()
  @IsDateString()
  supportStartDateTo?: string;

  @IsOptional()
  @IsDateString()
  @IsLessThanOrEqual('supportEndDateTo')
  supportEndDateFrom?: Date;

  @IsOptional()
  @IsDateString()
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
