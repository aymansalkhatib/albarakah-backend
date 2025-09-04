import { SelectQueryBuilder } from 'typeorm';
import { FamilyMemberFilterDto } from '../dtos/queries/family-member-filter.dto';
import { FamilyMember } from '../entities/family-members.entity';

export function applyFamilyMemberFilters(
  qb: SelectQueryBuilder<any>,
  alias: string,
  filter: FamilyMemberFilterDto,
): SelectQueryBuilder<FamilyMember> {
  if (filter.familyId) {
    qb.andWhere(`${alias}.familyId = :familyId`, { familyId: filter.familyId });
  }

  if (filter.personId) {
    qb.andWhere(`${alias}.personId = :personId`, { personId: filter.personId });
  }

  if (filter.relationType) {
    qb.andWhere(`${alias}.relationType = :relationType`, {
      relationType: filter.relationType,
    });
  }

  if (filter.isSponsored !== undefined) {
    qb.andWhere(`${alias}.isSponsored = :isSponsored`, {
      isSponsored: filter.isSponsored,
    });
  }

  if (filter.memberNumber) {
    qb.andWhere(`${alias}.memberNumber = :memberNumber`, {
      memberNumber: filter.memberNumber,
    });
  }

  if (filter.isPresent !== undefined) {
    qb.andWhere(`${alias}.isPresent = :isPresent`, {
      isPresent: filter.isPresent,
    });
  }

  if (filter.isGuardian !== undefined) {
    qb.andWhere(`${alias}.isGuardian = :isGuardian`, {
      isGuardian: filter.isGuardian,
    });
  }

  return qb;
}
