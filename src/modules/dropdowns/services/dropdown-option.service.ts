import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DropdownOption } from '../entities/dropdown-option.entity';

import { TranslateHelper } from '../../../shared/modules/app-i18n/translate.helper';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class DropdownOptionService {
  constructor(
    @InjectRepository(DropdownOption)
    private readonly dropdownOptionRepository: Repository<DropdownOption>,
    private readonly translateHelper: TranslateHelper,
  ) {}

  async findOne(id: number): Promise<DropdownOption> {
    const option = await this.dropdownOptionRepository.findOne({ where: { id } });
    if (!option) {
      throw new NotFoundException(
        this.translateHelper.tr('dropdowns.errors.option_not_found', { id }),
      );
    }
    return option;
  }
}
