import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { DropdownOption } from '../entities/dropdown-option.entity';

import { Injectable, NotFoundException } from '@nestjs/common';
import { TranslateHelper } from '../../../shared/modules/app-i18n/translate.helper';

@Injectable()
export class DropdownOptionService {
  constructor(
    @InjectRepository(DropdownOption)
    private readonly dropdownOptionRepository: Repository<DropdownOption>,
    private readonly translateHelper: TranslateHelper,
  ) {}

  async findOne(id: number, options: FindOneOptions<DropdownOption> = {}): Promise<DropdownOption> {
    const option = await this.dropdownOptionRepository.findOne({ where: { id }, ...options });
    if (!option) {
      throw new NotFoundException(
        this.translateHelper.tr('dropdowns.errors.option_not_found', { id }),
      );
    }
    return option;
  }
}
