import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, FindOneOptions, In, Repository } from 'typeorm';
import { PaginationResponseDto } from '../../../common/pagination/dto/pagination-response.dto';
import { paginate } from '../../../common/pagination/paginate.service';
import { FilterRoleDto } from '../../../modules/roles/dtos/queries/filter-role.dto';
import { CreateRoleDto } from '../../../modules/roles/dtos/requests/create-role.dto';
import { UpdateRoleDto } from '../../../modules/roles/dtos/requests/update-role.dto';
import { TranslateHelper } from '../../../shared/modules/app-i18n/translate.helper';
import { SystemUser } from '../../system-users/entities/system-user.entity';
import { isProtectedRoleName } from '../constants/protected-permissions.constant';
import { RoleResponseDto } from '../dtos/responses/role-response.dto';
import { PermissionEntity } from '../entities/permissions.entity';
import { RolePermission } from '../entities/role-permission.entity';
import { Role } from '../entities/roles.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(PermissionEntity)
    private readonly permissionRepository: Repository<PermissionEntity>,
    @InjectRepository(RolePermission)
    private readonly rolePermissionRepository: Repository<RolePermission>,
    @InjectRepository(SystemUser)
    private readonly systemUserRepository: Repository<SystemUser>,
    private readonly t: TranslateHelper,
  ) {}

  async createRole(createRoleDto: CreateRoleDto): Promise<Role> {
    const existingRole = await this.roleRepository.findOne({
      where: { name: createRoleDto.name },
    });
    if (existingRole) {
      throw new ConflictException(
        this.t.tr('roles.errors.role_name_exists', {
          name: createRoleDto.name,
        }),
      );
    }

    const role = this.roleRepository.create({
      name: createRoleDto.name,
      description: createRoleDto.description,
    });

    await this.roleRepository.save(role);

    await this.assignPermissionsToRole(role, createRoleDto.permissionIds);

    return this.findRoleById(role.id);
  }

  async findAllRole(
    filterDto: FilterRoleDto,
  ): Promise<PaginationResponseDto<RoleResponseDto>> {
    const queryBuilder = this.roleRepository.createQueryBuilder('role');
    queryBuilder.leftJoinAndSelect('role.rolePermissions', 'rolePermissions');
    queryBuilder.leftJoinAndSelect('rolePermissions.permission', 'permission');

    if (filterDto.name) {
      queryBuilder.andWhere('role.name ILIKE :name', {
        name: `%${filterDto.name}%`,
      });
    }

    if (filterDto.description) {
      queryBuilder.andWhere('role.description ILIKE :description', {
        description: `%${filterDto.description}%`,
      });
    }

    return paginate(queryBuilder, filterDto, RoleResponseDto);
  }

  async findRoleById(id: number): Promise<Role> {
    const role = await this.roleRepository.findOne({
      where: { id },
      relations: ['rolePermissions', 'rolePermissions.permission'],
    });

    if (!role) {
      throw new NotFoundException(
        this.t.tr('roles.errors.role_not_found', { id }),
      );
    }

    return role;
  }

  async updateRole(id: number, updateRoleDto: UpdateRoleDto): Promise<Role> {
    const role = await this.findRoleById(id);

    if (isProtectedRoleName(role.name)) {
      throw new ForbiddenException(this.t.tr('roles.errors.role_protected'));
    }

    if (updateRoleDto.name) {
      const existingRole = await this.roleRepository.findOne({
        where: { name: updateRoleDto.name },
      });
      if (existingRole && existingRole.id !== id) {
        throw new ConflictException(
          this.t.tr('roles.errors.role_name_in_use', {
            name: updateRoleDto.name,
          }),
        );
      }
      role.name = updateRoleDto.name;
    }
    if (updateRoleDto.description !== undefined) {
      role.description = updateRoleDto.description;
    }

    await this.roleRepository.save(role);

    if (updateRoleDto.permissionIds) {
      await this.rolePermissionRepository.delete({ roleId: id });
      await this.assignPermissionsToRole(role, updateRoleDto.permissionIds);
    }

    return this.findRoleById(id);
  }

  async deleteRole(id: number): Promise<void> {
    const role = await this.findRoleById(id);

    if (isProtectedRoleName(role.name)) {
      throw new ForbiddenException(
        this.t.tr('roles.errors.superadmin_role_protected'),
      );
    }

    const userCount = await this.systemUserRepository.count({
      where: { roleId: id },
    });
    if (userCount > 0) {
      throw new ConflictException(this.t.tr('roles.errors.role_has_users'));
    }

    await this.roleRepository.delete(role.id);
  }

  async assignPermissionsToRole(
    role: Role,
    permissionIds: number[],
  ): Promise<void> {
    if (!permissionIds) return;

    const foundPermissions = await this.permissionRepository.find({
      where: { id: In(permissionIds) },
    });

    if (foundPermissions.length !== permissionIds.length) {
      throw new NotFoundException(
        this.t.tr('roles.errors.permission_ids_not_exist'),
      );
    }

    const rolePermissions = permissionIds.map((permissionId) => ({
      roleId: role.id,
      permissionId,
    }));

    await this.rolePermissionRepository.save(rolePermissions);
  }

  async findOne(
    id: number,
    options: FindOneOptions<Role> = {},
    entityManager?: EntityManager,
  ): Promise<Role> {
    const roleRepository = entityManager
      ? entityManager.getRepository(Role)
      : this.roleRepository;

    const role = await roleRepository.findOne({ where: { id }, ...options });

    if (!role) {
      throw new NotFoundException(
        this.t.tr('roles.errors.role_not_found', { id }),
      );
    }

    return role;
  }
}
