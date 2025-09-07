import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { PositiveIntegerId } from '../../../../common/decorators/positive-integer-id.decorator';
import { ValidateMinMaxPairs } from '../../../../common/decorators/validate-min-max-pairs-constraint';
import { PaginationDto } from '../../../../common/pagination/dto/pagination.dto';
import { FamilyNeedStatus } from '../../enums/family-need-status.enum';
import { PriorityLevel } from '../../enums/priority-level.enum';

@ValidateMinMaxPairs()
export class FilterFamilyNeedDto extends PaginationDto {
  @IsOptional()
  @PositiveIntegerId()
  familyId?: number;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  needType?: string;

  @IsOptional()
  @IsString()
  @MaxLength(4096)
  notes?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(1000000)
  minQuantity?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(1000000)
  maxQuantity?: number;

  @IsOptional()
  @IsEnum(PriorityLevel)
  priorityLevel?: PriorityLevel;

  @IsOptional()
  @IsEnum(FamilyNeedStatus)
  status?: FamilyNeedStatus;

  @IsOptional()
  @IsString()
  sortOrder?: 'ASC' | 'DESC';
}
