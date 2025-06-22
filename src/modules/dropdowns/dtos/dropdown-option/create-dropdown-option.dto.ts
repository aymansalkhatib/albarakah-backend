import { IsBoolean, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { Expose } from 'class-transformer';
import { PositiveIntegerId } from 'src/common/decorators/positive-integer-id.decorator';
import { StrictBoolean } from 'src/common/decorators/strict-boolean.decorator';

export class UpsertDropdownOptionDto {
  @IsOptional()
  @PositiveIntegerId()
  id?: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @Expose()
  @StrictBoolean()
  isActive: boolean;
}
