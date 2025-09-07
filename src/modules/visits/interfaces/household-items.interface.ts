import { MobileStatus } from '../enums/mobile-status.enum';

export interface HouseholdItems {
  tables?: number;
  chairs?: number;
  batteries?: number;
  televisions?: number;
  screens?: number;
  waterCoolers?: number;
  microwaves?: number;
  vacuumCleaners?: number;
  computers?: number;
  laptops?: number;
  routers?: number;
  landlinePhones?: number;
  mobilePhones?: MobileStatus;
  electricOvens?: number;
  freezers?: number;
  notes?: string;
}
