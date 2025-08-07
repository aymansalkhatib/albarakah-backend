import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateEmergencyAidRequestDto } from './create-emergency-aid-request.dto';

export class UpdateEmergencyAidRequestDto extends PartialType(
  OmitType(CreateEmergencyAidRequestDto, ['familyId']),
) {}
