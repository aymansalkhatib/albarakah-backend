import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  Max,
  MinLength,
} from 'class-validator';
import { PositiveIntegerId } from '@app/common/decorators/positive-integer-id.decorator';

export class CreateFamilyIncomeDto {
  @PositiveIntegerId()
  familyId: number;

  @IsOptional()
  @PositiveIntegerId()
  familyMemberId?: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(1_000_000_000)
  amount: number;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(512)
  incomeSource: string;

  @IsOptional()
  @IsString()
  @MaxLength(4096)
  notes?: string;
}
