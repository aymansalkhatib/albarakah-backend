import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateSupporterChildSponsorshipDto } from './create-supporter-child-sponsorship.dto';

export class UpdateSupporterChildSponsorshipDto extends PartialType(
  OmitType(CreateSupporterChildSponsorshipDto, ['familyMemberId', 'supporterId']),
) {}
