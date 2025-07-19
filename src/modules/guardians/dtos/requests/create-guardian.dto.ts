import { IsEnum, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreatePersonDto } from '@app/modules/persons/dtos/requests/create-person.dto';
import { OnlyOneOf } from '@app/common/decorators/validate-one-of-two-fields.validator';
import { FamilyRelationType } from '@app/modules/beneficiary-families/enums/family-relation-type.enum';

@OnlyOneOf([
  {
    fields: ['person', 'personId'],
    isRequired: true,
  },
])
export class CreateGuardianDto {
  @IsOptional()
  @IsNumber()
  personId?: number;

  @IsEnum(FamilyRelationType)
  @IsOptional()
  relationType?: FamilyRelationType;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => CreatePersonDto)
  person?: CreatePersonDto;
}
