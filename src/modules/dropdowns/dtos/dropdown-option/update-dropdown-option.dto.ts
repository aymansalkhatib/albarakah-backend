import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { Expose } from 'class-transformer';
import { StrictBoolean } from 'src/common/decorators/strict-boolean.decorator';

export class UpdateDropdownOptionDto {
  @IsString()
  @IsOptional()
  @MaxLength(100)
  @Expose()
  name?: string;

  @IsOptional()
  @Expose()
  @StrictBoolean()
  isActive?: boolean;
}
