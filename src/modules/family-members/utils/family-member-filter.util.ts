import { SelectQueryBuilder } from 'typeorm';
import { FamilyMember } from '../entities/family-members.entity';
import { FamilyMemberFilterDto } from '../dtos/queries/family-member-filter.dto';

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

  return qb;
}
