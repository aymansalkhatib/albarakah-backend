import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Role } from '../entities/roles.entity';
import { PermissionEntity } from '../entities/permissions.entity';
import { RolePermission } from '../entities/role-permission.entity';
import { CreateRoleDto } from '@app/modules/roles/dtos/requests/create-role.dto';
import { UpdateRoleDto } from '@app/modules/roles/dtos/requests/update-role.dto';
import { FilterRoleDto } from '@app/modules/roles/dtos/queries/filter-role.dto';
import { PaginationResponseDto } from '@app/common/pagination/dto/pagination-response.dto';
import { paginate } from '@app/common/pagination/paginate.service';
import { isProtectedSystemUserPermission } from '../constants/protected-permissions.constant';
import { RoleResponseDto } from '../dtos/responses/role-response.dto';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(PermissionEntity)
    private readonly permissionRepository: Repository<PermissionEntity>,
    @InjectRepository(RolePermission)
    private readonly rolePermissionRepository: Repository<RolePermission>,
  ) {}

  async createRole(createRoleDto: CreateRoleDto): Promise<Role> {
    const existingRole = await this.roleRepository.findOne({ where: { name: createRoleDto.name } });
    if (existingRole) {
      throw new ConflictException(`Role with name "${createRoleDto.name}" already exists`);
    }

    const permissions = await this.validatePermissions(createRoleDto.permissionIds);

    const role = this.roleRepository.create({
      name: createRoleDto.name,
      description: createRoleDto.description,
      rolePermissions: permissions.map((permission) => ({
        permission: permission,
      })),
    });

    return await this.roleRepository.save(role);
  }

  async findAllRole(filterDto: FilterRoleDto): Promise<PaginationResponseDto<RoleResponseDto>> {
    const queryBuilder = this.roleRepository.createQueryBuilder('role');

    if (filterDto.id) {
      queryBuilder.andWhere('role.id = :id', { id: filterDto.id });
    }

    if (filterDto.name) {
      queryBuilder.andWhere('role.name LIKE :name', { name: `%${filterDto.name}%` });
    }

    return paginate(queryBuilder, filterDto, RoleResponseDto);
  }

  async findRoleById(id: number): Promise<Role> {
    const role = await this.roleRepository.findOne({
      where: { id },
      relations: ['rolePermissions', 'rolePermissions.permission'],
    });

    if (!role) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }

    return role;
  }

  async findByName(name: string): Promise<Role> {
    const role = await this.roleRepository.findOne({
      where: { name },
      relations: ['rolePermissions', 'rolePermissions.permission'],
    });

    if (!role) {
      throw new NotFoundException(`Role with name ${name} not found`);
    }

    return role;
  }

  async updateRole(id: number, updateRoleDto: UpdateRoleDto): Promise<Role> {
    const role = await this.findRoleById(id);

    if (updateRoleDto.name) {
      if (role.name.toLowerCase() === 'superadmin') {
        throw new ForbiddenException(
          'Superadmin role name cannot be changed as it contains protected system user permissions.',
        );
      }
      const existingRole = await this.roleRepository.findOne({
        where: { name: updateRoleDto.name },
      });
      if (existingRole && existingRole.id !== id) {
        throw new ConflictException(`Role name "${updateRoleDto.name}" is already in use`);
      }
      role.name = updateRoleDto.name;
    }
    if (updateRoleDto.description !== undefined) {
      role.description = updateRoleDto.description;
    }

    await this.roleRepository.save(role);

    if (updateRoleDto.permissionIds) {
      await this.rolePermissionRepository.delete({ roleId: id });
      await this.assignPermissionsToRole(id, updateRoleDto.permissionIds);
    }

    return this.findRoleById(id);
  }

  async deleteRole(id: number): Promise<void> {
    const role = await this.findRoleById(id);
    this.validateSuperAdminRoleDeletion(role);

    // Check if role is associated with any users
    const userCount = await this.roleRepository.count({
      where: {
        id,
        systemUsers: {
          roleId: id,
        },
      },
    });

    console.log(userCount);
    if (userCount > 0) {
      throw new ConflictException(
        'Cannot delete role because it is associated with one or more users. Please reassign users to different roles before deleting.',
      );
    }

    await this.roleRepository.remove(role);
  }

  async assignPermissionsToRole(roleId: number, permissionIds: number[]): Promise<void> {
    const permissions = await this.validatePermissions(permissionIds);
    this.validateSystemUserPermissions(permissions);

    const rolePermissions = permissionIds.map((permissionId) => ({
      roleId,
      permissionId,
    }));

    await this.rolePermissionRepository.save(rolePermissions);
  }

  private validateSystemUserPermissions(permissions: PermissionEntity[]): void {
    const protectedPermissions = permissions.filter((p) => isProtectedSystemUserPermission(p.name));

    if (protectedPermissions.length > 0) {
      const protectedNames = protectedPermissions.map((p) => p.name).join(', ');
      throw new ForbiddenException(
        `System user management permissions (${protectedNames}) can only be assigned to superadmin role. These permissions are protected and cannot be modified.`,
      );
    }
  }

  private validateSuperAdminRoleDeletion(role: Role): void {
    if (role.name.toLowerCase() === 'superadmin') {
      throw new ForbiddenException(
        'Superadmin role cannot be deleted as it contains protected system user permissions.',
      );
    }
  }

  private async validatePermissions(
    permissionIds: number[] | undefined,
  ): Promise<PermissionEntity[]> {
    if (!permissionIds) return [];

    const foundPermissions = await this.permissionRepository.find({
      where: { id: In(permissionIds) },
    });
    if (foundPermissions.length !== permissionIds.length) {
      throw new NotFoundException('One or more permission IDs do not exist');
    }
    this.validateSystemUserPermissions(foundPermissions);
    return foundPermissions;
  }
}
