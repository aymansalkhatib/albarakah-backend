import { Expose } from 'class-transformer';

export class VisitResponseDto {
  @Expose()
  id: number;

  @Expose()
  familyId?: number;

  @Expose()
  visitDate: Date;

  @Expose()
  visitDispatchDate?: Date;

  @Expose()
  visitNotes?: string;

  @Expose()
  familyMembersCount?: number;

  @Expose()
  houseResidentsCount?: number;

  @Expose()
  familyHealthConditions?: string;

  @Expose()
  visitCommitteeEvaluation?: string;

  @Expose()
  finalEvaluation?: string;

  @Expose()
  visitCommitteeMembers?: string[];

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
