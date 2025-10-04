import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { PaginationDto } from '../../../../common/pagination/dto/pagination.dto';
import { FilterPersonDto } from '../../../../modules/persons/dtos/queries/filter-person.dto';
import { PaymentCycle } from '../../enums/payment-cycle.enum';
import { SponsorshipType } from '../../enums/sponsorship-type.enum';

export class FilterSupporterDto extends PaginationDto {
  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsEnum(SponsorshipType)
  sponsorshipType?: SponsorshipType;

  @IsOptional()
  @IsEnum(PaymentCycle)
  paymentCycle?: PaymentCycle;

  @IsOptional()
  @IsNumber()
  sponsorshipAmount?: number;

  @IsOptional()
  @IsString()
  authorizedPersonName?: string;

  @IsOptional()
  @IsString()
  authorizedPersonPhone?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => FilterPersonDto)
  person?: FilterPersonDto;
}
