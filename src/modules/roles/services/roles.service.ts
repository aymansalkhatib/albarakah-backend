import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Role } from '../entities/roles.entity';
import { PermissionEntity } from '../entities/permissions.entity';
import { RolePermission } from '../entities/role-permission.entity';
import { CreateRoleDto } from '@app/modules/roles/dtos/requests/create-role.dto';
import { UpdateRoleDto } from '@app/modules/roles/dtos/requests/update-role.dto';
import { FilterRoleDto } from '@app/modules/roles/dtos/queries/filter-role.dto';
import { PaginationResponseDto } from '@app/common/pagination/dto/pagination-response.dto';
import { ResponseRoleDto } from '../dtos/responses/response-role.dto';
import { paginate } from '@app/common/pagination/paginate.service';

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

    // If permissionIds are provided, check if all exist
    if (createRoleDto.permissionIds?.length) {
      const foundPermissions = await this.permissionRepository.find({
        where: { id: In(createRoleDto.permissionIds) },
      });
      if (foundPermissions.length !== createRoleDto.permissionIds.length) {
        throw new NotFoundException('One or more permission IDs do not exist');
      }
    }

    const role = this.roleRepository.create({
      name: createRoleDto.name,
      description: createRoleDto.description,
      rolePermissions: (createRoleDto.permissionIds ?? []).map((permissionId) => ({
        permissionId,
      })),
    });

    return await this.roleRepository.save(role);
  }

  async findAllRole(filterDto: FilterRoleDto): Promise<PaginationResponseDto<ResponseRoleDto>> {
    const queryBuilder = this.roleRepository.createQueryBuilder('role');

    if (filterDto.id) {
      queryBuilder.andWhere('role.id = :id', { id: filterDto.id });
    }

    if (filterDto.name) {
      queryBuilder.andWhere('role.name LIKE :name', { name: `%${filterDto.name}%` });
    }

    return paginate(queryBuilder, filterDto, ResponseRoleDto);
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
    await this.roleRepository.remove(role);
  }

  async assignPermissionsToRole(roleId: number, permissionIds: number[]): Promise<void> {
    const rolePermissions = permissionIds.map((permissionId) => ({
      roleId,
      permissionId,
    }));

    await this.rolePermissionRepository.save(rolePermissions);
  }

  // Permission Management
}
