import { IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';
import { Expose } from 'class-transformer';
import { PositiveIntegerId } from 'src/common/decorators/positive-integer-id.decorator';
import { StrictBoolean } from 'src/common/decorators/strict-boolean.decorator';

export class CreateSelectedDropdownOptionDto {
  @IsNumber()
  @IsNotEmpty()
  @Expose()
  recordId: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  @Expose()
  recordType: string;

  @PositiveIntegerId()
  @Expose()
  dropdownId: number;

  @PositiveIntegerId()
  @Expose()
  selectedOptionId: number;
}
