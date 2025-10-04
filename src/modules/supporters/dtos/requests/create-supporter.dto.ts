import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { OnlyOneOf } from '../../../../common/decorators/validate-one-of-two-fields.validator';
import { CreatePersonDto } from '../../../../modules/persons/dtos/requests/create-person.dto';
import { PaymentCycle } from '../../enums/payment-cycle.enum';
import { SponsorshipType } from '../../enums/sponsorship-type.enum';

@OnlyOneOf([
  {
    fields: ['person', 'personId'],
    isRequired: true,
  },
])
export class CreateSupporterDto {
  @IsString()
  @IsOptional()
  address?: string;

  @IsEnum(SponsorshipType)
  @IsOptional()
  sponsorshipType?: SponsorshipType;

  @IsEnum(PaymentCycle)
  @IsOptional()
  paymentCycle?: PaymentCycle;

  @IsNumber()
  @IsOptional()
  sponsorshipAmount?: number;

  @IsString()
  @IsOptional()
  authorizedPersonName?: string;

  @IsString()
  @IsOptional()
  authorizedPersonPhone?: string;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => CreatePersonDto)
  person?: CreatePersonDto;

  @IsOptional()
  personId?: number;
}
