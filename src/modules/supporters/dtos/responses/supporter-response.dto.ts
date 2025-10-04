import { Expose, Type } from 'class-transformer';
import { PersonResponseDto } from '../../../../modules/persons/dtos/responses/person-response.dto';
import { PaymentCycle } from '../../enums/payment-cycle.enum';
import { SponsorshipType } from '../../enums/sponsorship-type.enum';

export class SupporterResponseDto {
  @Expose()
  id: number;

  @Expose()
  personId: number;

  @Expose()
  address?: string;

  @Expose()
  sponsorshipType?: SponsorshipType;

  @Expose()
  paymentCycle?: PaymentCycle;

  @Expose()
  sponsorshipAmount?: number;

  @Expose()
  authorizedPersonName?: string;

  @Expose()
  authorizedPersonPhone?: string;

  @Expose()
  notes?: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  @Type(() => PersonResponseDto)
  person?: PersonResponseDto;
}
