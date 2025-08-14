import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsArray,
  Min,
  Max,
  MaxLength,
} from 'class-validator';
import { Expose, Transform } from 'class-transformer';
import { PositiveIntegerId } from '../../../../common/decorators/positive-integer-id.decorator';

export class CreateVisitDto {
  @IsOptional()
  @PositiveIntegerId()
  @Expose()
  familyId?: number;

  @IsDateString()
  @IsNotEmpty()
  @Expose()
  visitDate: string;

  @IsOptional()
  @IsDateString()
  @Expose()
  visitDispatchDate?: string;

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
  familyMembersCount?: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 0 })
  @Min(0)
  @Max(100)
  @Expose()
  houseResidentsCount?: number;

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

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @MaxLength(100, { each: true })
  @Expose()
  visitCommitteeMembers?: string[];
}
