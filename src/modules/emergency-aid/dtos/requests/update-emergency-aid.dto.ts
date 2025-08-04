import { PartialType, PickType } from '@nestjs/mapped-types';
import { CreateEmergencyAidDto } from './create-emergency-aid.dto';

export class UpdateEmergencyAidDto extends PartialType(
  PickType(CreateEmergencyAidDto, ['familyId', 'notes', 'requestedAmount']),
) {}
