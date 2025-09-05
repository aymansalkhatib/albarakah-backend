import { IsDate, IsOptional, IsNumber, IsString, Min, Max, MaxLength } from 'class-validator';
import { Expose } from 'class-transformer';
import { IsLessThanOrEqual } from '../../../../common/decorators/is-less-than-or-equal.decorator';
import { PositiveIntegerId } from '../../../../common/decorators/positive-integer-id.decorator';
import { PaginationDto } from '../../../../common/pagination/dto/pagination.dto';

export class FilterVisitDto extends PaginationDto {
  
}
