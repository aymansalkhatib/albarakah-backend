import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateChildDto {
  @IsNumber()
  @IsNotEmpty()
  personId: number;

  @IsNumber()
  @IsNotEmpty()
  familyMemberId: number;

  @IsNumber()
  @IsNotEmpty()
  familyId: number;

  @IsBoolean()
  @IsOptional()
  isSponsored?: boolean;

  @IsString()
  @IsOptional()
  notes?: string;
}
