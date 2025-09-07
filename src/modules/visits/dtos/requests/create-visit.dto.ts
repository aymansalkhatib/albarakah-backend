import { Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';
import { PositiveIntegerId } from '../../../../common/decorators/positive-integer-id.decorator';
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

export class CreateVisitDto {
  @IsNumber()
  @IsNotEmpty()
  @PositiveIntegerId()
  familyId: number;

  @IsOptional()
  @IsDate()
  visitDate?: Date;

  @IsOptional()
  @IsString()
  @MaxLength(65535) // TEXT field can hold up to 65,535 characters
  committeeNotesAndSuggestionsOfTheVisitCommittee?: string;

  @IsOptional()
  @IsDate()
  paperSentDateOfTheVisit?: Date;

  @IsOptional()
  @IsEnum(FamilyRelationType)
  guardianRelationship?: FamilyRelationType;

  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  @Max(50)
  numberOfFamilyMembers: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  @Max(50)
  numberOfRemainingFamilyMembersInTheHouse: number;

  @IsOptional()
  @ValidateNested()
  @Type(() => RoadDto)
  road?: RoadDto;

  @IsOptional()
  @IsEnum(HouseCondition)
  houseCondition?: HouseCondition;

  @IsOptional()
  @IsString()
  @MaxLength(65535) // TEXT field can hold up to 65,535 characters
  notes?: string;

  @IsOptional()
  @IsEnum(HouseOwnership)
  houseOwnership?: HouseOwnership;

  @IsOptional()
  @ValidateNested()
  @Type(() => FurnishingsDto)
  furnishings?: FurnishingsDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => CarpetsAndMatsDto)
  carpetsAndMats?: CarpetsAndMatsDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => BlanketsDto)
  blankets?: BlanketsDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => QuiltsDto)
  quilts?: QuiltsDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => BedsDto)
  beds?: BedsDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => WardrobesDto)
  wardrobes?: WardrobesDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => HouseholdItemsDto)
  householdItems?: HouseholdItemsDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => WashingMachineDto)
  washingMachine?: WashingMachineDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => GasOvenDto)
  gasOven?: GasOvenDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => CoolingDevicesDto)
  coolingDevices?: CoolingDevicesDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => RefrigeratorDto)
  refrigerator?: RefrigeratorDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => HeatingDevicesDto)
  heatingDevices?: HeatingDevicesDto;

  @IsOptional()
  @IsString()
  @MaxLength(65535) // TEXT field can hold up to 65,535 characters
  wasteBasket?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(999999.99)
  schoolExpenses?: number;

  @IsOptional()
  @IsString()
  @MaxLength(65535) // TEXT field can hold up to 65,535 characters
  clothesCondition?: string;

  @IsOptional()
  @IsString()
  @MaxLength(65535) // TEXT field can hold up to 65,535 characters
  shoesCondition?: string;

  @IsOptional()
  @IsString()
  @MaxLength(65535) // TEXT field can hold up to 65,535 characters
  foodSuppliesCondition?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000) // VARCHAR(1000) field
  needsOrLuxuriesNotReportedInThePaper?: string;

  @IsOptional()
  @IsEnum(AlBarakaCharityIncomeAmount)
  barakaAssociationIncome?: AlBarakaCharityIncomeAmount;

  @IsOptional()
  @ValidateNested()
  @Type(() => IncomeDto)
  income?: IncomeDto;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(999999.99)
  availableSpendingWithoutAssociation?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(999999.99)
  totalIncomeWithoutAssociation?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(999999.99)
  amountOfRentIfTheApplicantIsTheOnePayingIt?: number;

  @IsOptional()
  @ValidateNested()
  @Type(() => WorkingIndividualDto)
  workingIndividual?: WorkingIndividualDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => DisabilityOrIllnessDto)
  disabilityOrIllness?: DisabilityOrIllnessDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => VisitCommitteeEvaluationDto)
  visitCommitteeEvaluation?: VisitCommitteeEvaluationDto;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @MaxLength(200, { each: true })
  committeeMembers?: string[];
}
