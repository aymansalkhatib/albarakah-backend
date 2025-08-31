import { Expose } from 'class-transformer';
import { ClothingSize } from '../../enums/clothing-size.enum';
import { CurrentStudyStatus } from '../../enums/current-study-status.enum';
import { EducationLevel } from '../../enums/education-level.enum';
import { GenderType } from '../../enums/gender-type.enum';
import { MaritalStatus } from '../../enums/marital-status.enum';
import { SchoolType } from '../../enums/school-type.enum';
import { SuccessCertificateSubmission } from '../../enums/success-certificate-submission-2023-2024.enum';

export class PersonResponseDto {
  @Expose()
  id: number;

  @Expose()
  fullName: string;

  @Expose()
  motherName?: string;

  @Expose()
  birthDate?: Date;

  @Expose()
  birthPlace?: string;

  @Expose()
  nationalId?: string;

  @Expose()
  nationality?: string;

  @Expose()
  motherNationality?: string;

  @Expose()
  isPalestinian?: boolean;

  @Expose()
  gender?: GenderType;

  shoeSize?: number;

  maritalStatus?: MaritalStatus;

  @Expose()
  isWorking?: boolean;

  @Expose()
  currentJob?: string;

  @Expose()
  jobDetails?: string;

  @Expose()
  isSmoker?: boolean;

  // If healthStatus is a free text in DB (string)
  @Expose()
  healthStatus?: string;

  @Expose()
  isHealthInsuranceUsed?: boolean;

  // Success certificate submission status (enum)
  @Expose()
  isSuccessCertificateSubmitted?: SuccessCertificateSubmission;

  // Education / study enums
  @Expose()
  educationLevel?: EducationLevel;

  @Expose()
  universityMajor?: string;

  @Expose()
  currentStudyStatus?: CurrentStudyStatus;

  @Expose()
  schoolType?: SchoolType;

  @Expose()
  schoolName?: string;

  // Phones
  @Expose()
  mobilePhone?: string;

  @Expose()
  landlinePhone?: string;

  @Expose()
  whatsappNumber?: string;

  @Expose()
  notes?: string;

  @Expose()
  clothingSize?: ClothingSize;
}
