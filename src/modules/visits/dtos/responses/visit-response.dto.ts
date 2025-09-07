import { Expose, Type } from 'class-transformer';
import { FamilyRelationType } from '../../../family-members/enums/family-relation-type.enum';
import { HouseCondition, HouseOwnership } from '../../enums';
import { AlBarakaCharityIncomeAmount } from '../../enums/al-baraka-charity-income-amount.enum';
import { BedsDto } from '../sub-dto/beds.dto';
import { BlanketsDto } from '../sub-dto/blankets.dto';
import { CarpetsAndMatsDto } from '../sub-dto/carpets-and-mats.dto';
import { CoolingDevicesDto } from '../sub-dto/cooling-devices.dto';
import { DisabilityOrIllnessDto } from '../sub-dto/disability-or-illness.dto';
import { FurnishingsDto } from '../sub-dto/furnishings.dto';
import { GasOvenDto } from '../sub-dto/gas-oven.dto';
import { HeatingDevicesDto } from '../sub-dto/heating-devices.dto';
import { HouseholdItemsDto } from '../sub-dto/household-items.dto';
import { IncomeDto } from '../sub-dto/income.dto';
import { QuiltsDto } from '../sub-dto/quilts.dto';
import { RefrigeratorDto } from '../sub-dto/refrigerator.dto';
import { RoadDto } from '../sub-dto/road.dto';
import { VisitCommitteeEvaluationDto } from '../sub-dto/visit-committee-evaluation.dto';
import { WardrobesDto } from '../sub-dto/wardrobes.dto';
import { WashingMachineDto } from '../sub-dto/washing-machine.dto';
import { WorkingIndividualDto } from '../sub-dto/working-individual.dto';

export class VisitResponseDto {
  @Expose()
  id: number;

  @Expose()
  familyId: number;

  @Expose()
  visitDate: Date;

  @Expose()
  committeeNotesAndSuggestionsOfTheVisitCommittee?: string;

  @Expose()
  paperSentDateOfTheVisit?: Date;

  @Expose()
  guardianRelationship?: FamilyRelationType;

  @Expose()
  numberOfFamilyMembers: number;

  @Expose()
  numberOfRemainingFamilyMembersInTheHouse: number;

  @Expose()
  @Type(() => RoadDto)
  road?: RoadDto;

  @Expose()
  houseCondition?: HouseCondition;

  @Expose()
  notes?: string;

  @Expose()
  houseOwnership?: HouseOwnership;

  @Expose()
  @Type(() => FurnishingsDto)
  furnishings?: FurnishingsDto;

  @Expose()
  @Type(() => CarpetsAndMatsDto)
  carpetsAndMats?: CarpetsAndMatsDto;

  @Expose()
  @Type(() => BlanketsDto)
  blankets?: BlanketsDto;

  @Expose()
  @Type(() => QuiltsDto)
  quilts?: QuiltsDto;

  @Expose()
  @Type(() => BedsDto)
  beds?: BedsDto;

  @Expose()
  @Type(() => WardrobesDto)
  wardrobes?: WardrobesDto;

  @Expose()
  @Type(() => HouseholdItemsDto)
  householdItems?: HouseholdItemsDto;

  @Expose()
  @Type(() => WashingMachineDto)
  washingMachine?: WashingMachineDto;

  @Expose()
  @Type(() => GasOvenDto)
  gasOven?: GasOvenDto;

  @Expose()
  @Type(() => CoolingDevicesDto)
  coolingDevices?: CoolingDevicesDto;

  @Expose()
  @Type(() => RefrigeratorDto)
  refrigerator?: RefrigeratorDto;

  @Expose()
  @Type(() => HeatingDevicesDto)
  heatingDevices?: HeatingDevicesDto;

  @Expose()
  wasteBasket?: string;

  @Expose()
  schoolExpenses?: number;

  @Expose()
  clothesCondition?: string;

  @Expose()
  shoesCondition?: string;

  @Expose()
  foodSuppliesCondition?: string;

  @Expose()
  needsOrLuxuriesNotReportedInThePaper?: string;

  @Expose()
  barakaAssociationIncome?: AlBarakaCharityIncomeAmount;

  @Expose()
  @Type(() => IncomeDto)
  income?: IncomeDto;

  @Expose()
  availableSpendingWithoutAssociation?: number;

  @Expose()
  totalIncomeWithoutAssociation?: number;

  @Expose()
  amountOfRentIfTheApplicantIsTheOnePayingIt?: number;

  @Expose()
  @Type(() => WorkingIndividualDto)
  workingIndividual?: WorkingIndividualDto;

  @Expose()
  @Type(() => DisabilityOrIllnessDto)
  disabilityOrIllness?: DisabilityOrIllnessDto;

  @Expose()
  @Type(() => VisitCommitteeEvaluationDto)
  visitCommitteeEvaluation?: VisitCommitteeEvaluationDto;

  @Expose()
  committeeMembers?: string[];

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
