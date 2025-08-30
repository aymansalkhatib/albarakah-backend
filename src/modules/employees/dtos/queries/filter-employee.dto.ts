import {
  IsDateString,
  IsOptional,
  IsString,
  Length,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { FilterPersonDto } from '../../../../modules/persons/dtos/queries/filter-person.dto';
import { IsLessThanOrEqual } from '../../../../common/decorators/is-less-than-or-equal.decorator';
import { PaginationDto } from '../../../../common/pagination/dto/pagination.dto';

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
  @IsLessThanOrEqual('hireDateFrom')
  hireDateTo?: string;

  @IsOptional()
  @IsDateString()
  terminationDateFrom?: string;

  @IsOptional()
  @IsDateString()
  @IsLessThanOrEqual('terminationDateFrom')
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
