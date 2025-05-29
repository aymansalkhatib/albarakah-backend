import { Type } from 'class-transformer';
import {
  IsOptional,
  IsPositive,
  Min,
  Max,
  IsString,
  IsEnum,
  ValidateNested,
  IsArray,
} from 'class-validator';

export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

export class SortDto {
  @IsString()
  field: string;

  @IsEnum(SortOrder)
  order: SortOrder;
}

export class PaginationDto {
  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SortDto)
  sort?: SortDto[];
}
