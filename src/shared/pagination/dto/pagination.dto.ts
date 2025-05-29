import { Type, Expose, Exclude, Transform } from 'class-transformer';
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

@Exclude()
export class PaginationDto {
  @Expose()
  @IsOptional()
  @Transform(({ value }) => (value ? Number(value) : 1))
  @Type(() => Number)
  @IsPositive()
  @Min(1)
  page: number;

  @Expose()
  @IsOptional()
  @Transform(({ value }) => (value ? Number(value) : 10))
  @Type(() => Number)
  @IsPositive()
  @Min(1)
  @Max(100)
  limit: number;

  @Expose()
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SortDto)
  sort?: SortDto[];
}
