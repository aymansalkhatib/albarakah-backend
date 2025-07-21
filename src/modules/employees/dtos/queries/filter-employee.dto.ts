import {
  IsDateString,
  IsOptional,
  IsString,
  Length,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { FilterPersonDto } from '@app/modules/persons/dtos/queries/filter-person.dto';
import { IsAfterDate } from '@app/common/decorators/is-after-date.decorator';
import { PaginationDto } from '@app/common/pagination/dto/pagination.dto';

export class FilterEmployeeDto extends PaginationDto {
  @IsOptional()
  @IsString()
  @Length(1, 100)
  position?: string;

  @IsOptional()
  @IsString()
  @Length(1, 100)
  username?: string;

  @IsOptional()
  @IsDateString()
  hireDateFrom?: string;

  @IsOptional()
  @IsDateString()
  @IsAfterDate('hireDateFrom')
  hireDateTo?: string;

  @IsOptional()
  @IsDateString()
  terminationDateFrom?: string;

  @IsOptional()
  @IsDateString()
  @IsAfterDate('terminationDateFrom')
  terminationDateTo?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  search?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => FilterPersonDto)
  person?: FilterPersonDto;
}
