import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './entities/roles.entity';
import { PermissionEntity } from './entities/permissions.entity';
import { RolePermission } from './entities/role-permission.entity';
import { CreateRoleDto } from './dto/request/create-role.dto';
import { UpdateRoleDto } from './dto/request/update-role.dto';
import { FilterRoleDto } from './dto/query/filter-role.dto';
import { CreatePermissionDto } from './dto/request/create-permission.dto';
import { ROLE_HIERARCHY, UserRole } from './enums/role.enum';
import { UpdatePermissionDto } from './dto/request/update-permission.dto';
import { FilterPermissionDto } from './dto/query/filter-permission.dto';
import { Permission } from './enums/permission.enum';

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

  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    const role = this.roleRepository.create({
      name: createRoleDto.name,
      description: createRoleDto.description,
    });

    const savedRole = await this.roleRepository.save(role);

    if (createRoleDto.permissionIds?.length) {
      await this.assignPermissionsToRole(savedRole.id, createRoleDto.permissionIds);
    }

    return this.findOne(savedRole.id);
  }

  async findAll(filterDto: FilterRoleDto): Promise<Role[]> {
    const queryBuilder = this.roleRepository
      .createQueryBuilder('role')
      .leftJoinAndSelect('role.rolePermissions', 'rolePermissions')
      .leftJoinAndSelect('rolePermissions.permission', 'permission');

    if (filterDto.id) {
      queryBuilder.andWhere('role.id = :id', { id: filterDto.id });
    }

    if (filterDto.name) {
      queryBuilder.andWhere('role.name LIKE :name', { name: `%${filterDto.name}%` });
    }

    if (filterDto.search) {
      queryBuilder.andWhere('(role.name LIKE :search OR role.description LIKE :search)', {
        search: `%${filterDto.search}%`,
      });
    }

    return queryBuilder.getMany();
  }

  async findOne(id: number): Promise<Role> {
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

  async update(id: number, updateRoleDto: UpdateRoleDto): Promise<Role> {
    const role = await this.findOne(id);

    if (updateRoleDto.name) {
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

    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const role = await this.findOne(id);
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
  async createPermission(createPermissionDto: CreatePermissionDto): Promise<PermissionEntity> {
    const permission = this.permissionRepository.create(createPermissionDto);
    return this.permissionRepository.save(permission);
  }

  async findAllPermissions(filterDto: FilterPermissionDto): Promise<PermissionEntity[]> {
    const queryBuilder = this.permissionRepository.createQueryBuilder('permission');

    if (filterDto.id) {
      queryBuilder.andWhere('permission.id = :id', { id: filterDto.id });
    }

    if (filterDto.search) {
      queryBuilder.andWhere(
        '(permission.name LIKE :search OR permission.description LIKE :search)',
        { search: `%${filterDto.search}%` },
      );
    }

    return queryBuilder.getMany();
  }

  async findPermissionById(id: number): Promise<PermissionEntity> {
    const permission = await this.permissionRepository.findOne({
      where: { id },
      relations: ['rolePermissions', 'rolePermissions.role'],
    });

    if (!permission) {
      throw new NotFoundException(`Permission with ID ${id} not found`);
    }

    return permission;
  }

  async findPermissionByName(name: Permission): Promise<PermissionEntity> {
    const permission = await this.permissionRepository.findOne({
      where: { name },
    });

    if (!permission) {
      throw new NotFoundException(`Permission with name ${name} not found`);
    }

    return permission;
  }

  async updatePermission(
    id: number,
    updatePermissionDto: UpdatePermissionDto,
  ): Promise<PermissionEntity> {
    const permission = await this.findPermissionById(id);

    if (updatePermissionDto.name !== undefined) {
      permission.name = updatePermissionDto.name;
    }
    if (updatePermissionDto.description !== undefined) {
      permission.description = updatePermissionDto.description;
    }

    return this.permissionRepository.save(permission);
  }

  async removePermission(id: number): Promise<void> {
    const permission = await this.findPermissionById(id);
    await this.permissionRepository.remove(permission);
  }

  async getPermissionsForRole(roleId: number): Promise<PermissionEntity[]> {
    const role = await this.roleRepository.findOne({
      where: { id: roleId },
      relations: ['rolePermissions', 'rolePermissions.permission'],
    });

    if (!role) {
      throw new NotFoundException(`Role with ID ${roleId} not found`);
    }

    return role.rolePermissions.map((rp) => rp.permission);
  }

  async getPermissionsForRoleName(roleName: string): Promise<PermissionEntity[]> {
    const role = await this.roleRepository.findOne({
      where: { name: roleName },
      relations: ['rolePermissions', 'rolePermissions.permission'],
    });

    if (!role) {
      throw new NotFoundException(`Role with name ${roleName} not found`);
    }

    return role.rolePermissions.map((rp) => rp.permission);
  }

  // تحقق ما إذا كان المستخدم يمتلك دورًا معينًا
  hasRole(userRoles: UserRole[], requiredRole: UserRole): boolean {
    return userRoles.some(
      (userRole) =>
        userRole === requiredRole ||
        (ROLE_HIERARCHY[userRole] && ROLE_HIERARCHY[userRole].includes(requiredRole)),
    );
  }

  // تحقق ما إذا كان المستخدم يمتلك أي من الأدوار المطلوبة
  hasAnyRole(userRoles: UserRole[], requiredRoles: UserRole[]): boolean {
    return requiredRoles.some((required) => this.hasRole(userRoles, required));
  }

  // تحقق ما إذا كان المستخدم يمتلك جميع الأدوار المطلوبة
  hasAllRoles(userRoles: UserRole[], requiredRoles: UserRole[]): boolean {
    return requiredRoles.every((required) => this.hasRole(userRoles, required));
  }

  // تحقق ما إذا كان المستخدم يمتلك جميع الصلاحيات المطلوبة
  async hasAllPermissions(userRoles: UserRole[], requiredPermissions: string[]): Promise<boolean> {
    const userPermissions = new Set<string>();

    for (const role of userRoles) {
      try {
        const permissions = await this.getPermissionsForRoleName(role);
        permissions.forEach((p) => userPermissions.add(p.name));
      } catch (error) {
        // إذا لم يتم العثور على الدور، نتجاهل الخطأ ونستمر
      }
    }

    return requiredPermissions.every((p) => userPermissions.has(p));
  }

  // تحقق ما إذا كان المستخدم يمتلك أي من الصلاحيات المطلوبة
  async hasAnyPermission(userRoles: UserRole[], requiredPermissions: string[]): Promise<boolean> {
    const userPermissions = new Set<string>();

    for (const role of userRoles) {
      try {
        const permissions = await this.getPermissionsForRoleName(role);
        permissions.forEach((p) => userPermissions.add(p.name));
      } catch (error) {
        // إذا لم يتم العثور على الدور، نتجاهل الخطأ ونستمر
      }
    }

    return requiredPermissions.some((p) => userPermissions.has(p));
  }
}
