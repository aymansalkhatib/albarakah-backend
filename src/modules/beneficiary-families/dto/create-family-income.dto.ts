import { IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, Min } from 'class-validator';
import { Expose } from 'class-transformer';

export class CreateFamilyIncomeDto {
  @IsNumber()
  @IsNotEmpty()
  @Expose()
  familyId: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  @Expose()
  amount: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  @Expose()
  incomeSource: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  @Expose()
  notes?: string;
}
