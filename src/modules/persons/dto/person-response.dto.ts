import { GenderType } from '../enums/gender-type.enum';
import { ClothingSize } from '../enums/clothing-size.enum';
import { Exclude, Expose, Type } from 'class-transformer';

@Exclude()
export class PersonResponseDto {
  @Expose()
  id: number;

  @Expose()
  fatherId?: number;

  @Expose()
  motherId?: number;

  @Expose()
  firstName: string;

  @Expose()
  lastName: string;

  @Expose()
  birthDate?: Date;

  @Expose()
  nationalId?: string;

  @Expose()
  isPalestinian: boolean;

  @Expose()
  gender?: GenderType;

  @Expose()
  nationality?: string;

  @Expose()
  birthPlace?: string;

  @Expose()
  isWorking: boolean;

  @Expose()
  currentJob?: string;

  @Expose()
  jobDetails?: string;

  @Expose()
  isSmoker: boolean;

  @Expose()
  healthStatusId?: number;

  @Expose()
  educationLevelId?: number;

  @Expose()
  schoolTypeId?: number;

  @Expose()
  personStatusId?: number;

  @Expose()
  maritalStatusId?: number;

  @Expose()
  universityMajor?: string;

  @Expose()
  email?: string;

  @Expose()
  phone?: string;

  @Expose()
  address?: string;

  @Expose()
  shoeSize?: number;

  @Expose()
  clothingSize?: ClothingSize;

  @Expose()
  notes?: string;

  // Relationships
  @Expose()
  @Type(() => PersonResponseDto)
  father?: PersonResponseDto;

  @Expose()
  @Type(() => PersonResponseDto)
  mother?: PersonResponseDto;
}
