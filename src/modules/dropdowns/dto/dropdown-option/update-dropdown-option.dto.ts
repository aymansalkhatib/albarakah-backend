import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { Expose } from 'class-transformer';

export class UpdateDropdownOptionDto {
  @IsString()
  @IsOptional()
  @MaxLength(100)
  @Expose()
  name?: string;

  @Expose()
  isActive?: boolean;
}
