import { IsDate, IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from '../../../../common/pagination/dto/pagination-query.dto';
import { PositiveIntegerId } from '../../../../common/decorators/positive-integer-id.decorator';
import { IsLessThanOrEqual } from '../../../../common/decorators/is-less-than-or-equal.decorator';
import { Type } from 'class-transformer';
import { FilterPersonDto } from '../../../../modules/persons/dtos/queries/filter-person.dto';
import { FilterFamilyDto } from '../../../families/dtos/queries/filter-family.dto';
import { FilterEmployeeDto } from '../../../employees/dtos/queries/filter-employee.dto';

export class FilterInterviewDto extends PaginationQueryDto {
  @IsOptional()
  @PositiveIntegerId()
  familyId?: number;

  @IsOptional()
  @PositiveIntegerId()
  interviewerId?: number;

  @IsOptional()
  @IsString()
  purpose?: string;

  @IsOptional()
  @IsString()
  summary?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsDate()
  dateFrom?: Date;

  @IsOptional()
  @IsLessThanOrEqual('dateFrom')
  dateTo?: Date;

  @IsOptional()
  @Type(() => FilterFamilyDto)
  family?: FilterFamilyDto;

  @IsOptional()
  @Type(() => FilterEmployeeDto)
  interviewer?: FilterEmployeeDto;
}
