import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';
import { Expose } from 'class-transformer';
import { FamilyRelationType } from '../../enums/family-relation-type.enum';

export class CreateFamilyMemberDto {
  @IsNumber()
  @IsNotEmpty()
  @Expose()
  personId: number;

  @IsNumber()
  @IsNotEmpty()
  @Expose()
  familyId: number;

  @IsEnum(FamilyRelationType)
  @IsNotEmpty()
  @Expose()
  relationType: FamilyRelationType;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  @Expose()
  notes?: string;
}
