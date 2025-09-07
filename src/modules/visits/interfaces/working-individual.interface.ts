import { WorkingIndividualAge } from '../enums/working-individual-age-status';

export interface WorkingIndividual {
  age?: WorkingIndividualAge;
  notes?: string;
}
