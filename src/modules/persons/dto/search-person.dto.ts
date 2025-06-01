import { IsOptional, IsString } from 'class-validator';

export class SearchPersonDto {
  @IsOptional()
  @IsString()
  nationalId?: string;

  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;
}
