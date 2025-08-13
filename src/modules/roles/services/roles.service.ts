import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Role } from '../entities/roles.entity';
import { PermissionEntity } from '../entities/permissions.entity';
import { RolePermission } from '../entities/role-permission.entity';
import { CreateRoleDto } from '../../../modules/roles/dtos/requests/create-role.dto';
import { UpdateRoleDto } from '../../../modules/roles/dtos/requests/update-role.dto';
import { FilterRoleDto } from '../../../modules/roles/dtos/queries/filter-role.dto';
import { PaginationResponseDto } from '../../../common/pagination/dto/pagination-response.dto';
import { paginate } from '../../../common/pagination/paginate.service';
import { isProtectedRoleName } from '../constants/protected-permissions.constant';
import { RoleResponseDto } from '../dtos/responses/role-response.dto';
import { SystemUser } from '../../system-users/entities/system-user.entity';

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
  ) {}

  async createRole(createRoleDto: CreateRoleDto): Promise<Role> {
    const existingRole = await this.roleRepository.findOne({ where: { name: createRoleDto.name } });
    if (existingRole) {
      throw new ConflictException(`Role with name "${createRoleDto.name}" already exists`);
    }

    const role = this.roleRepository.create({
      name: createRoleDto.name,
      description: createRoleDto.description,
    });

    await this.roleRepository.save(role);

    await this.assignPermissionsToRole(role, createRoleDto.permissionIds);

    return this.findRoleById(role.id);
  }

  async findAllRole(filterDto: FilterRoleDto): Promise<PaginationResponseDto<RoleResponseDto>> {
    const queryBuilder = this.roleRepository.createQueryBuilder('role');
    queryBuilder.leftJoinAndSelect('role.rolePermissions', 'rolePermissions');
    queryBuilder.leftJoinAndSelect('rolePermissions.permission', 'permission');

    if (filterDto.name) {
      queryBuilder.andWhere('role.name ILIKE :name', { name: `%${filterDto.name}%` });
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
      throw new NotFoundException(`Role with ID ${id} not found`);
    }

    return role;
  }

  async updateRole(id: number, updateRoleDto: UpdateRoleDto): Promise<Role> {
    const role = await this.findRoleById(id);

    if (isProtectedRoleName(role.name)) {
      throw new ForbiddenException('This role is protected by the system and cannot be changed.');
    }

    if (updateRoleDto.name) {
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
      await this.assignPermissionsToRole(role, updateRoleDto.permissionIds);
    }

    return this.findRoleById(id);
  }

  async deleteRole(id: number): Promise<void> {
    const role = await this.findRoleById(id);

    if (isProtectedRoleName(role.name)) {
      throw new ForbiddenException(
        'Superadmin role cannot be deleted as it contains protected system user permissions.',
      );
    }

    const userCount = await this.systemUserRepository.count({ where: { roleId: id } });
    if (userCount > 0) {
      throw new ConflictException(
        'Cannot delete role because it is associated with one or more users. Please reassign users to different roles before deleting.',
      );
    }

    await this.roleRepository.delete(role.id);
  }

  async assignPermissionsToRole(role: Role, permissionIds: number[]): Promise<void> {
    if (!permissionIds) return;

    const foundPermissions = await this.permissionRepository.find({
      where: { id: In(permissionIds) },
    });

    if (foundPermissions.length !== permissionIds.length) {
      throw new NotFoundException('One or more permission IDs do not exist');
    }

    const rolePermissions = permissionIds.map((permissionId) => ({
      roleId: role.id,
      permissionId,
    }));

    await this.rolePermissionRepository.save(rolePermissions);
  }
}
