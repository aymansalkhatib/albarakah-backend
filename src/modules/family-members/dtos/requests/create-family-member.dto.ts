import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { PositiveIntegerId } from '../../../../common/decorators/positive-integer-id.decorator';
import { StrictBoolean } from '../../../../common/decorators/strict-boolean.decorator';
import { OnlyOneOf } from '../../../../common/decorators/validate-one-of-two-fields.validator';
import { CreatePersonDto } from '../../../../modules/persons/dtos/requests/create-person.dto';
import { FamilyRelationType } from '../../enums/family-relation-type.enum';
import { IsPresent } from '../../enums/is-present.enum';

@OnlyOneOf([
  {
    fields: ['person', 'personId'],
    isRequired: true,
  },
])
export class CreateFamilyMemberDto {
  @IsNumber()
  @IsNotEmpty()
  familyId: number;

  @IsEnum(FamilyRelationType)
  @IsNotEmpty()
  relationType: FamilyRelationType;

  @IsOptional()
  @StrictBoolean()
  isSponsored: boolean;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  memberNumber?: number;

  @IsOptional()
  @IsEnum(IsPresent)
  isPresent?: IsPresent;

  @IsOptional()
  @StrictBoolean()
  isGuardian?: boolean;

  @IsOptional()
  @IsString()
  @MaxLength(4096)
  notes?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => CreatePersonDto)
  person?: CreatePersonDto;

  @IsOptional()
  @PositiveIntegerId()
  personId?: number;
}
