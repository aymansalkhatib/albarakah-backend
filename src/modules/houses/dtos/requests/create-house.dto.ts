import { IsBoolean, IsNumber, IsOptional, IsString, MaxLength, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateHouseDto {
  @IsNumber()
  @Min(1)
  familyId: number;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  locationText?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  coordinates?: string;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => Boolean(value))
  isRented?: boolean;

  @IsOptional()
  @IsNumber()
  @Min(0)
  rentAmount?: number;
}
