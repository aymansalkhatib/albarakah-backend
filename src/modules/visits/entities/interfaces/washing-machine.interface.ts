import { WashingMachineType } from '../enums/washing-machine-type.enum';

export interface WashingMachine {
  count?: number;
  type?: WashingMachineType;
  notes?: string;
}
