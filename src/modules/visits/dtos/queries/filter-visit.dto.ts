import { IsDate, IsOptional, IsNumber, IsString, Min, Max, MaxLength } from 'class-validator';
import { Expose } from 'class-transformer';
import { IsLessThanOrEqual } from '../../../../common/decorators/is-less-than-or-equal.decorator';
import { PositiveIntegerId } from '../../../../common/decorators/positive-integer-id.decorator';
import { PaginationDto } from '../../../../common/pagination/dto/pagination.dto';

export class FilterVisitDto extends PaginationDto {
  @IsOptional()
  @PositiveIntegerId()
  @Expose()
  familyId?: number;

  @IsOptional()
  @IsDate()
  @Expose()
  visitDateFrom?: Date;

  @IsOptional()
  @IsDate()
  @IsLessThanOrEqual('visitDateTo', {
    message: 'Visit date from must be before or equal to visit date to',
  })
  @Expose()
  visitDateTo?: Date;

  @IsOptional()
  @IsDate()
  @Expose()
  visitDispatchDateFrom?: Date;

  @IsOptional()
  @IsDate()
  @IsLessThanOrEqual('visitDispatchDateTo', {
    message: 'Visit dispatch date from must be before or equal to visit dispatch date to',
  })
  @Expose()
  visitDispatchDateTo?: Date;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  @Expose()
  visitNotes?: string;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 0 })
  @Min(0)
  @Max(100)
  @Expose()
  minFamilyMembersCount?: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 0 })
  @Min(0)
  @Max(100)
  @Expose()
  maxFamilyMembersCount?: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 0 })
  @Min(0)
  @Max(100)
  @Expose()
  minHouseResidentsCount?: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 0 })
  @Min(0)
  @Max(100)
  @Expose()
  maxHouseResidentsCount?: number;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  @Expose()
  familyHealthConditions?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  @Expose()
  visitCommitteeEvaluation?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  @Expose()
  finalEvaluation?: string;
}
