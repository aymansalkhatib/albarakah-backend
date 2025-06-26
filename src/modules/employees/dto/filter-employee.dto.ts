import {
  IsDateString,
  IsOptional,
  IsString,
  Length,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { IsAfterDate } from '../../../common/decorators/is-after-date.decorator';
import { FilterPersonDto } from '@app/modules/persons/dtos/queries/filter-person.dto';

export class FilterEmployeeDto {
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
  @IsString()
  @MaxLength(100)
  search?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => FilterPersonDto)
  person?: FilterPersonDto;
}
