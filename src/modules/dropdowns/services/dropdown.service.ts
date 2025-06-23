import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Dropdown } from '../entities/dropdown.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Not, Repository } from 'typeorm';
import { DropdownCategoryService } from './dropdown-category.service';
import { UpsertDropdownDto } from '../dtos/dropdown/upsert-dropdown.dto';
import { TranslateHelper } from '../../../shared/modules/app-i18n/translate.helper';
import { DropdownOption } from '../entities/dropdown-option.entity';

@Injectable()
export class DropdownService {
  constructor(
    @InjectRepository(Dropdown)
    private readonly dropdownRepository: Repository<Dropdown>,
    @InjectRepository(DropdownOption)
    private readonly dropdownOptionRepository: Repository<DropdownOption>,
    private readonly dropdownCategoryService: DropdownCategoryService,
    private readonly translateHelper: TranslateHelper,
    private readonly dataSource: DataSource,
  ) {}

  async upsert(upsertDto: UpsertDropdownDto): Promise<Dropdown> {
    return await this.dataSource.transaction(async (manager) => {
      // Validate category exists
      await this.dropdownCategoryService.ensureExists(upsertDto.dropdownCategoryId);

      // Check for duplicate dropdown name
      await this.checkDuplicateDropdownName(
        upsertDto.dropdownName,
        upsertDto.dropdownCategoryId,
        upsertDto.id,
      );

      // Create or update dropdown
      let dropdown = this.dropdownRepository.create({
        id: upsertDto.id,
        dropdownCategoryId: upsertDto.dropdownCategoryId,
        dropdownName: upsertDto.dropdownName,
        selectionType: upsertDto.selectionType,
      });

      dropdown = await manager.save(Dropdown, dropdown);

      // Handle options upsert
      if (upsertDto.options && upsertDto.options.length > 0) {
        await this.handleOptionsUpsert(dropdown.id, upsertDto.options, manager);
      }

      // Return the complete dropdown with options
      return await manager.findOne(Dropdown, {
        where: { id: dropdown.id },
        relations: ['options'],
      });
    });
  }

  async remove(id: number): Promise<void> {
    return await this.dataSource.transaction(async (manager) => {
      // Find dropdown with options
      const dropdown = await manager.findOne(Dropdown, {
        where: { id },
        relations: ['options'],
      });

      if (!dropdown) {
        throw new NotFoundException(
          this.translateHelper.tr('dropdowns.errors.dropdown_not_found', { id }),
        );
      }

      // Delete options first if they exist
      if (dropdown.options && dropdown.options.length > 0) {
        for (const option of dropdown.options) {
          try {
            await manager.remove(DropdownOption, option);
          } catch (err: any) {
            if (err?.code === '23503') {
              throw new BadRequestException(
                `Cannot delete dropdown option '${option.name}': This option is referenced by other data.`,
              );
            }
            throw err;
          }
        }
      }

      // Delete dropdown
      try {
        await manager.remove(Dropdown, dropdown);
      } catch (err: any) {
        if (err?.code === '23503') {
          throw new BadRequestException(
            `Cannot delete dropdown '${dropdown.dropdownName}': This dropdown is referenced by other data.`,
          );
        }
        throw err;
      }
    });
  }

  async findByCategory(categoryId: number): Promise<Dropdown[]> {
    await this.dropdownCategoryService.ensureExists(categoryId);
    return this.dropdownRepository.find({
      where: { dropdownCategory: { id: categoryId } },
    });
  }

  async findOne(id: number): Promise<Dropdown> {
    const dropdown = await this.dropdownRepository.findOne({
      where: { id },
      relations: ['options'],
    });

    if (!dropdown) {
      throw new NotFoundException(
        this.translateHelper.tr('dropdowns.errors.dropdown_not_found', { id }),
      );
    }

    return dropdown;
  }

  async ensureExists(id: number): Promise<Dropdown> {
    const dropdown = await this.dropdownRepository.findOne({ where: { id } });
    if (!dropdown) {
      throw new NotFoundException(
        this.translateHelper.tr('dropdowns.errors.dropdown_not_found', { id }),
      );
    }
    return dropdown;
  }

  // Private helper methods

  private async handleOptionsUpsert(
    dropdownId: number,
    optionsDto: any[],
    manager: any,
  ): Promise<void> {
    // Validate duplicates in request
    this.validateDuplicateOptionsInRequest(optionsDto);

    // Get existing options for this dropdown
    const existingOptions = await manager.find(DropdownOption, {
      where: { dropdownId },
    });

    // Validate that options to update exist
    this.validateOptionsExist(optionsDto, existingOptions);

    // Validate duplicates against existing options
    this.validateDuplicateOptionsInDatabase(optionsDto, existingOptions);

    // Prepare options for upsert
    const optionsToUpsert = optionsDto.map((optionDto) =>
      this.dropdownOptionRepository.create({
        id: optionDto.id,
        dropdownId,
        name: optionDto.name,
        isActive: optionDto.isActive,
      }),
    );

    // Save all options
    await manager.save(DropdownOption, optionsToUpsert);

    // Handle deletion of options not present in the request
    await this.handleOptionsDelete(optionsDto, existingOptions, manager);
  }

  private validateDuplicateOptionsInRequest(optionsDto: any[]): void {
    const nameSet = new Set();
    const duplicates: string[] = [];

    for (const optionDto of optionsDto) {
      if (nameSet.has(optionDto.name)) {
        duplicates.push(optionDto.name);
      }
      nameSet.add(optionDto.name);
    }

    if (duplicates.length > 0) {
      throw new BadRequestException(
        `Duplicate option names found in request: ${duplicates.join(', ')}`,
      );
    }
  }

  private validateDuplicateOptionsInDatabase(
    optionsDto: any[],
    existingOptions: DropdownOption[],
  ): void {
    for (const optionDto of optionsDto) {
      const duplicateInDb = existingOptions.find(
        (existing) => existing.name === optionDto.name && existing.id !== optionDto.id,
      );

      if (duplicateInDb) {
        throw new BadRequestException(
          `Option name '${optionDto.name}' already exists in this dropdown`,
        );
      }
    }
  }

  private async handleOptionsDelete(
    optionsDto: any[],
    existingOptions: DropdownOption[],
    manager: any,
  ): Promise<void> {
    const optionIdsInRequest = optionsDto.filter((opt) => opt.id).map((opt) => opt.id);

    const optionsToDelete = existingOptions.filter(
      (existing) => !optionIdsInRequest.includes(existing.id),
    );

    if (optionsToDelete.length > 0) {
      for (const option of optionsToDelete) {
        try {
          await manager.remove(DropdownOption, option);
        } catch (err: any) {
          if (err?.code === '23503') {
            throw new BadRequestException(
              `Cannot delete dropdown option '${option.name}': This option is referenced by other data.`,
            );
          }
          throw err;
        }
      }
    }
  }

  private async checkDuplicateDropdownName(
    dropdownName: string,
    dropdownCategoryId: number,
    excludeId?: number,
  ): Promise<void> {
    const where: any = {
      dropdownName,
      dropdownCategoryId,
    };

    if (excludeId !== undefined) {
      where.id = Not(excludeId);
    }

    const existingDropdown = await this.dropdownRepository.findOne({
      where,
    });

    if (existingDropdown) {
      throw new ConflictException(
        `Dropdown with name '${dropdownName}' already exists in this category`,
      );
    }
  }

  private validateOptionsExist(optionsDto: any[], existingOptions: DropdownOption[]): void {
    const optionIdsToUpdate = optionsDto.filter((opt) => opt.id).map((opt) => opt.id);

    if (optionIdsToUpdate.length > 0) {
      const foundOptionIds = existingOptions.map((opt) => opt.id);
      const missingOptionIds = optionIdsToUpdate.filter((id) => !foundOptionIds.includes(id));

      if (missingOptionIds.length > 0) {
        const missingOptionNames = optionsDto
          .filter((opt) => missingOptionIds.includes(opt.id))
          .map((opt) => opt.name);

        throw new BadRequestException(
          `Cannot update dropdown options: The following options were not found: ${missingOptionNames.join(', ')}`,
        );
      }
    }
  }
}
