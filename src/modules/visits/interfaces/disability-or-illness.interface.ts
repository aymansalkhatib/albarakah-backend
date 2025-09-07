import { DisabilityStatus } from '../enums/disability-status.enum';

export interface DisabilityOrIllness {
  status?: DisabilityStatus;
  notes?: string;
}
