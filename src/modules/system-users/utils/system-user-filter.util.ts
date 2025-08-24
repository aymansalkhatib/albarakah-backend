import { SelectQueryBuilder } from 'typeorm';
import { FilterSystemUserDto } from '../dtos/queries/filter-system-user.dto';
import { SystemUser } from '../entities/system-user.entity';

export function applySystemUserFilters(
  qb: SelectQueryBuilder<any>,
  alias: string,
  filterDto: FilterSystemUserDto,
): SelectQueryBuilder<SystemUser> {
  // Filter by roleId (direct role ID)
  if (filterDto.roleId) {
    qb.andWhere(`${alias}.roleId = :roleId`, {
      roleId: filterDto.roleId,
    });
  }

  // Filter by username
  if (filterDto.username) {
    qb.andWhere(`${alias}.username ILIKE :username`, {
      username: `%${filterDto.username}%`,
    });
  }

  // Role filters
  if (filterDto.role) {
    if (filterDto.role.name) {
      qb.andWhere('(role.name ILIKE :name)', {
        name: `%${filterDto.role.name}%`,
      });
    }
  }

  return qb;
}
